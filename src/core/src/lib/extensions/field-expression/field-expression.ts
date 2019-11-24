import { FormlyFieldConfig, FormlyValueChangeEvent, FormlyFieldConfigCache } from '../../models';
import { isObject, isNil, isUndefined, isFunction, defineHiddenProp, observe, reduceFormUpdateValidityCalls, getFieldValue, assignFieldValue } from '../../utils';
import { evalExpression, evalStringExpression } from './utils';
import { Observable, Subscription } from 'rxjs';
import { FormlyExtension } from '../../models';
import { unregisterControl, registerControl, updateValidity } from '../field-form/utils';
import { FormArray } from '@angular/forms';

/** @experimental */
export class FieldExpressionExtension implements FormlyExtension {
  onPopulate(field: FormlyFieldConfigCache) {
    if (field._expressions) {
      return;
    }

    // cache built expression
    defineHiddenProp(field, '_expressions', {});
    field.expressionProperties = field.expressionProperties || {};

    observe(field, ['hide'], ({ currentValue, firstChange }) => {
      field._hide = currentValue;
      if (!firstChange || (firstChange && currentValue === true)) {
        field.templateOptions.hidden = currentValue;
        field.options._hiddenFieldsForCheck.push(field);
      }
    });

    if (field.hideExpression) {
      observe(field, ['hideExpression'], ({ currentValue: expr }) => {
        field._expressions.hide = this.parseExpressions(field, 'hide', typeof expr === 'boolean' ? () => expr : expr);
      });
    }

    for (const key of Object.keys(field.expressionProperties)) {
      observe(field, ['expressionProperties', key], ({ currentValue: expr }) => {
        if (typeof expr === 'string' || isFunction(expr)) {
          field._expressions[key] = this.parseExpressions(field, key, expr);
        } else if (expr instanceof Observable) {
          const subscribe = () =>
            (expr as Observable<any>).subscribe(v => {
              this.evalExpr(field, key, v);
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
      });
    }
  }

  postPopulate(field: FormlyFieldConfigCache) {
    if (field.parent) {
      return;
    }

    if (!field.options._checkField) {
      let checkLocked = false;
      field.options._checkField = (f, ignoreCache) => {
        if (!checkLocked) {
          checkLocked = true;

          reduceFormUpdateValidityCalls(f.formControl, () => this.checkExpressions(f, ignoreCache));
          const options = field.options;
          options._hiddenFieldsForCheck.sort(f => (f.hide ? -1 : 1)).forEach(f => this.changeHideState(f, f.hide, !ignoreCache));

          options._hiddenFieldsForCheck = [];
          checkLocked = false;
        }
      };
    }
  }

  private parseExpressions(field: FormlyFieldConfigCache, path: string, expr: any) {
    let parentExpression: any;
    if (field.parent && ['hide', 'templateOptions.disabled'].includes(path)) {
      parentExpression = evalStringExpression(`!!field.parent.${path}`, ['field']);
    }

    expr = expr || (() => false);
    if (typeof expr === 'string') {
      expr = evalStringExpression(expr, ['model', 'formState', 'field']);
    }

    let currentValue: any;

    return (ignoreCache?: boolean) => {
      try {
        const exprValue = evalExpression(
          parentExpression ? (...args) => parentExpression(field) || expr(...args) : expr,
          { field },
          [field.model, field.options.formState, field],
        );

        if (
          ignoreCache ||
          (currentValue !== exprValue &&
            (!isObject(exprValue) || JSON.stringify(exprValue) !== JSON.stringify(currentValue)))
        ) {
          currentValue = exprValue;
          this.evalExpr(field, path, exprValue);

          return true;
        }

        return false;
      } catch (error) {
        error.message = `[Formly Error] [Expression "${path}"] ${error.message}`;
        throw error;
      }
    };
  }

  private checkExpressions(field: FormlyFieldConfigCache, ignoreCache = false) {
    if (!field) {
      return;
    }

    let markForCheck = false;
    if (field._expressions) {
      for (const key of Object.keys(field._expressions)) {
        field._expressions[key](ignoreCache) && (markForCheck = true);
      }
    }

    if (field.fieldGroup) {
      field.fieldGroup.forEach(f => this.checkExpressions(f, ignoreCache));
    }

    if (markForCheck && field.options && field.options._markForCheck) {
      field.options._markForCheck(field);
    }
  }

  private changeDisabledState(field: FormlyFieldConfig, value: boolean) {
    if (field.fieldGroup) {
      field.fieldGroup
        .filter(f => !f.expressionProperties || !f.expressionProperties.hasOwnProperty('templateOptions.disabled'))
        .forEach(f => this.changeDisabledState(f, value));
    }

    if (field.key && field.templateOptions.disabled !== value) {
      field.templateOptions.disabled = value;
    }
  }

  private changeHideState(field: FormlyFieldConfig, hide: boolean, resetOnHide: boolean) {
    if (field.formControl && field.key) {
      defineHiddenProp(field, '_hide', !!(hide || field.hide));
      const c = field.formControl;
      if (c['_fields'].length > 1) {
        updateValidity(c);
      }

      if (hide === true && c['_fields'].every(f => !!f._hide)) {
        unregisterControl(field);
        if (resetOnHide && field['autoClear']) {
          field.formControl.reset({ value: undefined, disabled: field.formControl.disabled });
          if (field.fieldGroup) {
            assignFieldValue(field, undefined);

            if (field.formControl instanceof FormArray) {
              field.fieldGroup.length = 0;
            }
          }
        }
      } else if (hide === false) {
        if (field['autoClear'] && field.parent && !isUndefined(field.defaultValue) && isUndefined(getFieldValue(field))) {
          assignFieldValue(field, field.defaultValue);
        }
        registerControl(field);
        if (field['autoClear'] && field.fieldArray && (field.fieldGroup || []).length !== (field.model || []).length) {
          (<any> field.options)._buildForm(true);
        }
      }
    }

    if (field.fieldGroup) {
      field.fieldGroup.filter(f => !f.hideExpression).forEach(f => this.changeHideState(f, hide, resetOnHide));
    }

    if (field.options.fieldChanges) {
      field.options.fieldChanges.next(<FormlyValueChangeEvent>{ field, type: 'hidden', value: hide });
    }
  }

  private evalExpr(field: FormlyFieldConfigCache, prop: string, value: any) {
    try {
      let target = field;
      const paths = (prop.indexOf('[') === -1 ? prop : prop.replace(/\[(\w+)\]/g, '.$1')).split('.');
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
      this.changeDisabledState(field, value);
    }

    if (prop.indexOf('model.') === 0) {
      const key = prop.replace(/^model\./, ''),
        control = field.key && field.key === key ? field.formControl : field.form.get(key);

      if (control && !(isNil(control.value) && isNil(value)) && control.value !== value) {
        control.patchValue(value, { emitEvent: false });
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
