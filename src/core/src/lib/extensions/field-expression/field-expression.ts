import { FormlyFieldConfig, FormlyValueChangeEvent, FormlyFieldConfigCache } from '../../components/formly.field.config';
import { isObject, isNullOrUndefined, isUndefined, isFunction, defineHiddenProp, wrapProperty, reduceFormUpdateValidityCalls, getFieldValue, assignFieldValue } from '../../utils';
import { evalExpression, evalStringExpression } from './utils';
import { isObservable, Observable, Subscription } from 'rxjs';
import { FormlyExtension } from '../../services/formly.config';
import { unregisterControl, registerControl, updateValidity } from '../field-form/utils';
import { FormArray } from '@angular/forms';

/** @experimental */
export class FieldExpressionExtension implements FormlyExtension {
  prePopulate(field: FormlyFieldConfigCache) {
    if (field.parent || field.options._checkField) {
      return;
    }

    let checkLocked = false;
    field.options._checkField = (f, ignoreCache) => {
      if (!checkLocked) {
        checkLocked = true;
        reduceFormUpdateValidityCalls(
          f.formControl,
          () => this.checkField(f, ignoreCache),
        );
        checkLocked = false;
      }
    };
  }

  postPopulate(field: FormlyFieldConfigCache) {
    if (!field.parent || field._expressionProperties) {
      return;
    }

    // cache built expression
    defineHiddenProp(field, '_expressionProperties', {});

    if (field.expressionProperties) {
      for (const key in field.expressionProperties) {
        const expressionProperty = field.expressionProperties[key];

        if (typeof expressionProperty === 'string' || isFunction(expressionProperty)) {
          field._expressionProperties[key] = {
            expression: this._evalExpression(
              key,
              expressionProperty,
              key === 'templateOptions.disabled' && field.parent.expressionProperties && field.parent.expressionProperties.hasOwnProperty('templateOptions.disabled')
                ? () => field.parent.templateOptions.disabled
                : undefined,
            ),
          };
          if (key === 'templateOptions.disabled') {
            Object.defineProperty(field._expressionProperties[key], 'expressionValue', {
              get: () => field.templateOptions.disabled,
              set: () => { },
              enumerable: true,
              configurable: true,
            });
          }
        } else if (expressionProperty instanceof Observable) {
          const subscribe = () => (expressionProperty as Observable<any>)
            .subscribe(v => {
              this.setExprValue(field, key, v);
              if (field.options && field.options._markForCheck) {
                field.options._markForCheck(field);
              }
            });

          let subscription: Subscription = subscribe();
          const onInit = field.hooks.onInit;
          field.hooks.onInit = () => {
            if (subscription === null) {
              subscription = subscribe();
            }
            return onInit && onInit(field);
          };

          const onDestroy = field.hooks.onDestroy;
          field.hooks.onDestroy = () => {
            onDestroy && onDestroy(field);
            subscription.unsubscribe();
            subscription = null;
          };
        }
      }
    }

    if (field.hideExpression) {
      // delete hide value in order to force re-evaluate it in FormlyFormExpression.
      delete field.hide;

      field.hideExpression = this._evalExpression(
        'hide',
        field.hideExpression,
        () => {
          let root = field.parent;
          while (root.parent && !root.hide) {
            root = root.parent;
          }

          return root.hide;
        },
      );
    } else {
      wrapProperty(field, 'hide', ({ currentValue, firstChange }) => {
        field._hide = currentValue;
        if (!firstChange || (firstChange && currentValue === true)) {
          field.options._hiddenFieldsForCheck.push(field);
        }
      });
    }
  }

  private _evalExpression(prop: string, expression, parentExpression?) {
    return (...args) => {
      try {
        if (typeof expression === 'string') {
          expression = evalStringExpression(expression, ['model', 'formState', 'field']);
        }

        if (typeof expression !== 'function') {
          expression = () => !!expression;
        }

        return (parentExpression && parentExpression()) || expression(...args);
      } catch (error) {
        error.message = `[Formly Error] [Expression "${prop}"] ${error.message}`;
        throw error;
      }
    };
  }

  private checkField(field: FormlyFieldConfigCache, ignoreCache = false) {
    const fieldChanged = this._checkField(field, ignoreCache);

    field.options._hiddenFieldsForCheck
      .sort(f => f.hide ? -1 : 1)
      .forEach(f => this.toggleFormControl(f, !!f.hide, !ignoreCache));

    field.options._hiddenFieldsForCheck = [];
    if (fieldChanged) {
      this.checkField(field);
      if (field.options && field.options._markForCheck) {
        field.options._markForCheck(field);
      }
    }
  }

  private _checkField(field: FormlyFieldConfigCache, ignoreCache = false) {
    let fieldChanged = false;
    field.fieldGroup.forEach(f => {
      if (!f.options) {
        return;
      }

      this.checkFieldExpressionChange(f, ignoreCache) && (fieldChanged = true);
      if (this.checkFieldVisibilityChange(f, ignoreCache)) {
        field.options._hiddenFieldsForCheck.push(f);
        fieldChanged = true;
      }

      if (f.fieldGroup && f.fieldGroup.length > 0) {
        this._checkField(f, ignoreCache) && (fieldChanged = true);
      }
    });

    return fieldChanged;
  }

  private checkFieldExpressionChange(field: FormlyFieldConfigCache, ignoreCache): boolean {
    if (!field || !field._expressionProperties) {
      return false;
    }

    let markForCheck = false;
    const expressionProperties = field._expressionProperties;

    for (const key in expressionProperties) {
      let expressionValue = evalExpression(expressionProperties[key].expression, { field }, [field.model, field.options.formState, field, ignoreCache]);
      if (key === 'templateOptions.disabled') {
        expressionValue = !!expressionValue;
      }

      if (
        ignoreCache || (
          expressionProperties[key].expressionValue !== expressionValue
          && (
            !(isObject(expressionValue) || isFunction(expressionValue))
            || (
              isFunction(expressionValue)
              && ('' + expressionProperties[key].expressionValue !== '' + expressionValue)
            )
            || isObservable(expressionValue)
            || JSON.stringify(expressionValue) !== JSON.stringify(expressionProperties[key].expressionValue)
          )
        )
      ) {
        markForCheck = true;
        expressionProperties[key].expressionValue = expressionValue;
        this.setExprValue(field, key, expressionValue);
      }
    }

    return markForCheck;
  }

  private checkFieldVisibilityChange(field: FormlyFieldConfigCache, ignoreCache): boolean {
    if (!field || isNullOrUndefined(field.hideExpression)) {
      return false;
    }

    const hideExpressionResult: boolean = !!evalExpression(
      field.hideExpression,
      { field },
      [field.model, field.options.formState, field, ignoreCache],
    );
    let markForCheck = false;
    if (hideExpressionResult !== field.hide || ignoreCache) {
      markForCheck = true;
      // toggle hide
      field.hide = hideExpressionResult;
      field.templateOptions.hidden = hideExpressionResult;
    }

    return markForCheck;
  }

  private setDisabledState(field: FormlyFieldConfig, value: boolean) {
    if (field.fieldGroup) {
      field.fieldGroup
        .filter(f => !f.expressionProperties || !f.expressionProperties.hasOwnProperty('templateOptions.disabled'))
        .forEach(f => this.setDisabledState(f, value));
    }

    if (field.key && field.templateOptions.disabled !== value) {
      field.templateOptions.disabled = value;
    }
  }

  private toggleFormControl(field: FormlyFieldConfigCache, hide: boolean, resetOnHide: boolean) {
    if (field.fieldGroup) {
      field.fieldGroup
        .filter(f => !f.hideExpression)
        .forEach(f => this.toggleFormControl(f, hide, resetOnHide));
    }

    if (field.formControl && field.key) {
      defineHiddenProp(field, '_hide', !!(hide || field.hide));
      const c = field.formControl;
      if (c['_fields'] && c['_fields'].length > 1) {
        updateValidity(c);
      }

      if (hide === true && (!c['_fields'] || c['_fields'].every(f => !!f._hide))) {
        unregisterControl(field, true);
        if (resetOnHide && field.resetOnHide) {
          field.formControl.reset({ value: undefined, disabled: field.formControl.disabled });
          if (field.fieldGroup) {
            assignFieldValue(field, undefined);

            if (field.formControl instanceof FormArray) {
              field.fieldGroup.length = 0;
            }
          }
        }
      } else if (hide === false) {
        if (field.resetOnHide && field.parent && !isUndefined(field.defaultValue) && isUndefined(getFieldValue(field))) {
          assignFieldValue(field, field.defaultValue);
        }
        registerControl(field, undefined, true);
        if (field.resetOnHide && field.fieldArray && (field.fieldGroup || []).length !== (field.model || []).length) {
          (<any> field.options)._buildForm(true);
        }
      }
    }

    if (field.options.fieldChanges) {
      field.options.fieldChanges.next(<FormlyValueChangeEvent> { field, type: 'hidden', value: hide });
    }
  }

  private setExprValue(field: FormlyFieldConfigCache, prop: string, value: any) {
    try {
      let target = field;
      const paths = prop.indexOf('[') === -1
        ? prop.split('.')
        : prop
          .replace(/\'|\"/g, '')
          .split(/[[\]]{1,2}/) // https://stackoverflow.com/a/20198206
          .filter(v => v)
      ;
      const lastIndex = paths.length - 1;
      for (let i = 0; i < lastIndex; i++) {
        target = target[paths[i]];
      }

      target[paths[lastIndex]] = value;
    } catch (error) {
      error.message = `[Formly Error] [Expression "${prop}"] ${error.message}`;
      throw error;
    }

    if (prop === 'templateOptions.disabled' && field.key) {
      this.setDisabledState(field, value);
    }

    if (prop.indexOf('model.') === 0) {
      const path = prop.replace(/^model\./, ''),
        control = field.key && prop === path ? field.formControl : field.parent.formControl.get(path);

      if (
        control
        && !(isNullOrUndefined(control.value) && isNullOrUndefined(value))
        && control.value !== value
      ) {
        control.patchValue(value);
      }
    }

    this.emitExpressionChanges(field, prop, value);
  }

  private emitExpressionChanges(field: FormlyFieldConfigCache, property: string, value: any) {
    if (!field.options.fieldChanges) {
      return;
    }

    field.options.fieldChanges.next({
      field: field,
      type: 'expressionChanges',
      property,
      value,
    });
  }
}
