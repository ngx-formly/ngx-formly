import { FormGroup, FormArray } from '@angular/forms';
import { FormlyFieldConfig, FormlyValueChangeEvent, FormlyFieldConfigCache } from '../../components/formly.field.config';
import { isObject, isNullOrUndefined, isFunction, FORMLY_VALIDATORS, getKeyPath, defineHiddenProp } from '../../utils';
import { evalExpression, evalStringExpression, evalExpressionValueSetter, removeFieldControl, addFieldControl } from './utils';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormlyExtension } from '../../services/formly.config';

/** @experimental */
export class FieldExpressionExtension implements FormlyExtension {
  prePopulate(field: FormlyFieldConfigCache) {
    if (field.parent || field.options._checkField) {
      return;
    }

    field.options._checkField = (f, ignoreCache) => this._checkField(f, ignoreCache);
  }

  onPopulate(field: FormlyFieldConfigCache) {
    if (!field.parent || field._expressionProperties) {
      return;
    }

    // cache built expression
    defineHiddenProp(field, '_expressionProperties', {});

    if (field.expressionProperties) {
      for (const key in field.expressionProperties) {
        const expressionProperty = field.expressionProperties[key],
          expressionValueSetter = evalExpressionValueSetter(
            `field.${key}`,
            ['expressionValue', 'model', 'field'],
          );

        if (typeof expressionProperty === 'string' || isFunction(expressionProperty)) {
          field._expressionProperties[key] = {
            expression: this._evalExpression(
              expressionProperty,
              field.parent.expressionProperties && field.parent.expressionProperties.hasOwnProperty('templateOptions.disabled')
                ? () => field.parent.templateOptions.disabled
                : undefined,
            ),
            expressionValueSetter,
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
          const subscription = (expressionProperty as Observable<any>).pipe(
            tap(v => evalExpression(expressionValueSetter, { field }, [v, field.model, field])),
          ).subscribe();

          const onDestroy = field.hooks.onDestroy;
          field.hooks.onDestroy = (field) => {
            onDestroy && onDestroy(field);
            subscription.unsubscribe();
          };
        }
      }
    }

    if (field.hideExpression) {
      // delete hide value in order to force re-evaluate it in FormlyFormExpression.
      delete field.hide;

      let parent = field.parent;
      while (parent && !parent.hideExpression) {
        parent = parent.parent;
      }

      field.hideExpression = this._evalExpression(
        field.hideExpression,
        parent && parent.hideExpression ? () => parent.hide : undefined,
      );
    }
  }

  postPopulate(field: FormlyFieldConfigCache) {
    if (field.parent) {
      return;
    }

    field.options._checkField(field, true);
  }

  private _evalExpression(expression, parentExpression?) {
    expression = expression || (() => false);
    if (typeof expression === 'string') {
      expression = evalStringExpression(expression, ['model', 'formState']);
    }

    return parentExpression
      ? (model: any, formState: any) => parentExpression() || expression(model, formState)
      : expression;
  }

  private _checkField(field: FormlyFieldConfigCache, ignoreCache = false) {
    let markForCheck = false;
    field.fieldGroup.forEach(f => {
      this.checkFieldExpressionChange(f, ignoreCache) && (markForCheck = true);
      this.checkFieldVisibilityChange(f, ignoreCache) && (markForCheck = true);

      if (f.fieldGroup && f.fieldGroup.length > 0) {
        this._checkField(f, ignoreCache);
      }
    });

    if (markForCheck && field.options && field.options._markForCheck) {
      field.options._markForCheck(field);
    }
  }

  private checkFieldExpressionChange(field: FormlyFieldConfigCache, ignoreCache): boolean {
    if (!field || !field._expressionProperties) {
      return false;
    }

    let markForCheck = false;
    const expressionProperties = field._expressionProperties;
    const validators = FORMLY_VALIDATORS.map(v => `templateOptions.${v}`);

    for (const key in expressionProperties) {
      let expressionValue = evalExpression(expressionProperties[key].expression, { field }, [field.model, field.options.formState]);
      if (key === 'templateOptions.disabled') {
        expressionValue = !!expressionValue;
      }

      if (
        ignoreCache || (
          expressionProperties[key].expressionValue !== expressionValue
          && (!isObject(expressionValue) || JSON.stringify(expressionValue) !== JSON.stringify(expressionProperties[key].expressionValue))
        )
      ) {
        markForCheck = true;
        expressionProperties[key].expressionValue = expressionValue;
        evalExpression(
          expressionProperties[key].expressionValueSetter,
          { field },
          [expressionValue, field.model, field],
        );

        if (key.indexOf('model.') === 0) {
          const path = key.replace(/^model\./, ''),
            control = field.key && key === path ? field.formControl : field.parent.formControl.get(path);

          if (
            control
            && !(isNullOrUndefined(control.value) && isNullOrUndefined(expressionValue))
            && control.value !== expressionValue
          ) {
            control.patchValue(expressionValue);
          }
        }

        if (validators.indexOf(key) !== -1 && field.formControl) {
          field.formControl.updateValueAndValidity({ emitEvent: false });
        }
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
      [field.model, field.options.formState],
    );
    let markForCheck = false;
    if (hideExpressionResult !== field.hide || ignoreCache) {
      markForCheck = true;
      // toggle hide
      field.hide = hideExpressionResult;
      field.templateOptions.hidden = hideExpressionResult;
      this.toggleFormControl(field, hideExpressionResult);
    }

    return markForCheck;
  }

  private toggleFormControl(field: FormlyFieldConfig, hide: boolean) {
    if (field.fieldGroup) {
      field.fieldGroup
        .filter(f => !f.hideExpression)
        .forEach(f => this.toggleFormControl(f, hide));
    }

    if (field.formControl && field.key) {
      const parent = this.fieldParentFormControl(field);
      if (parent) {
        if (hide === true && field.formControl.parent) {
          removeFieldControl(parent, field);
        } else if (hide === false && !field.formControl.parent) {
          addFieldControl(parent, field);
        }
      }
    }

    if (field.options.fieldChanges) {
      field.options.fieldChanges.next(<FormlyValueChangeEvent> { field: field, type: 'hidden', value: hide });
    }
  }

  private fieldParentFormControl(field: FormlyFieldConfig): FormArray | FormGroup {
    const paths = getKeyPath(field);
    paths.pop(); // remove last path

    return (paths.length > 0 ? field.parent.formControl.get(paths) : field.parent.formControl) as any;
  }
}
