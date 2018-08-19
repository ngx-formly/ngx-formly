import { FormGroup, FormArray } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyValueChangeEvent, FormlyFieldConfigCache } from '../../components/formly.field.config';
import {
  isObject, isNullOrUndefined, isFunction,
  FORMLY_VALIDATORS, getFieldValue, getKeyPath, removeFieldControl,
} from '../../utils';
import { evalExpression, evalStringExpression, evalExpressionValueSetter } from './utils';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormlyExtension } from '../../services/formly.config';

export class FieldExpressionExtension implements FormlyExtension {
  onPopulate(field: FormlyFieldConfigCache) {
    if (field._expressionProperties) {
      return;
    }

    // cache built expression
    field._expressionProperties = field._expressionProperties || {};

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

          const onDestroy = field.lifecycle.onDestroy;
          field.lifecycle.onDestroy = (...args) => {
            if (onDestroy) {
              onDestroy(...args);
            }
            subscription.unsubscribe();
          };
        }
      }
    }

    if (field.hideExpression || field.parent.hideExpression) {
      // delete hide value in order to force re-evaluate it in FormlyFormExpression.
      delete field.hide;
      field.hideExpression = this._evalExpression(
        field.hideExpression,
        field.parent && field.parent.hideExpression ? () => field.parent.hide : undefined,
      );
    }

    if (!field.options._checkField) {
      field.options._checkField = (f) => this._checkFields(<FormGroup> f.formControl, f.fieldGroup, f.options);
    }
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

  private _checkFields(form: FormGroup | FormArray, fields: FormlyFieldConfigCache[] = [], options: FormlyFormOptions) {
    fields.forEach(field => {
      this.checkFieldExpressionChange(form, field, options);
      this.checkFieldVisibilityChange(form, field, options);

      if (field.fieldGroup && field.fieldGroup.length > 0) {
        this._checkFields(field.formControl ? <FormGroup> field.formControl : form, field.fieldGroup as any, options);
      }
    });
  }

  private checkFieldExpressionChange(form: FormGroup | FormArray, field: FormlyFieldConfigCache, options: FormlyFormOptions) {
    if (!field || !field._expressionProperties) {
      return;
    }

    const expressionProperties = field._expressionProperties;
    const validators = FORMLY_VALIDATORS.map(v => `templateOptions.${v}`);

    for (const key in expressionProperties) {
      let expressionValue = evalExpression(expressionProperties[key].expression, { field }, [field.model, options.formState]);
      if (key === 'templateOptions.disabled') {
        expressionValue = expressionValue || false;
      }

      if (
        expressionProperties[key].expressionValue !== expressionValue
        && (!isObject(expressionValue) || JSON.stringify(expressionValue) !== JSON.stringify(expressionProperties[key].expressionValue))
      ) {
        expressionProperties[key].expressionValue = expressionValue;
        evalExpression(
          expressionProperties[key].expressionValueSetter,
          { field },
          [expressionValue, field.model, field],
        );

        if (key.indexOf('model.') === 0) {
          const path = key.replace(/^model\./, ''),
            control = field.key && key === path ? field.formControl : form.get(path);

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
  }

  private checkFieldVisibilityChange(form: FormGroup | FormArray, field: FormlyFieldConfig, options: FormlyFormOptions) {
    if (!field || isNullOrUndefined(field.hideExpression)) {
      return;
    }

    const hideExpressionResult: boolean = !!evalExpression(
      field.hideExpression,
      { field },
      [field.model, options.formState],
    );

    if (hideExpressionResult !== field.hide) {
      // toggle hide
      field.hide = hideExpressionResult;
      field.templateOptions.hidden = hideExpressionResult;

      if (field.formControl && field.key) {
        const parent = this.fieldParentFormControl(form, field);
        if (parent) {
          const control = parent.get(`${this.fieldKey(field)}`);
          if (hideExpressionResult === true && control) {
            removeFieldControl(parent, this.fieldKey(field));
          } else if (hideExpressionResult === false && !control) {
            this.addFieldControl(parent, field);
          }
        }
      }

      if (options.fieldChanges) {
        options.fieldChanges.next(<FormlyValueChangeEvent> { field: field, type: 'hidden', value: hideExpressionResult });
      }
    }
  }

  private addFieldControl(parent: FormArray | FormGroup, field: FormlyFieldConfig) {
    const fieldModel = getFieldValue(field);
    if (
      !(isNullOrUndefined(field.formControl.value) && isNullOrUndefined(fieldModel))
      && field.formControl.value !== fieldModel
    ) {
      field.formControl.patchValue(fieldModel, { emitEvent: false });
    }

    if (parent instanceof FormArray) {
      parent.push(field.formControl);
    } else if (parent instanceof FormGroup) {
      parent.addControl(`${this.fieldKey(field)}`, field.formControl);
    }
  }

  private fieldParentFormControl(form: FormGroup | FormArray, field: FormlyFieldConfig): FormArray | FormGroup {
    const paths = getKeyPath(field);
    paths.pop(); // remove last path

    return (paths.length > 0 ? form.get(paths) : form) as any;
  }

  private fieldKey(field: FormlyFieldConfig) {
    return getKeyPath(field).pop();
  }
}
