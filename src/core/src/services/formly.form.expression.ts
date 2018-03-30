import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyValueChangeEvent } from '../components/formly.field.config';
import { evalExpression, FORMLY_VALIDATORS, getFieldModel, isObject, getKeyPath, isNullOrUndefined } from '../utils';

/**
 * @internal
 */
@Injectable()
export class FormlyFormExpression {
  checkFields(form: FormGroup | FormArray, fields: FormlyFieldConfig[] = [], model: any, options: FormlyFormOptions) {
    this._checkFields(form, fields, model, options);
  }

  private _checkFields(form: FormGroup | FormArray, fields: FormlyFieldConfig[] = [], model: any, options: FormlyFormOptions) {
    fields.forEach(field => {
      this.checkFieldExpressionChange(form, field, this.getParentModel(model, field), options);
      this.checkFieldVisibilityChange(form, field, this.getParentModel(model, field), options);

      if (field.fieldGroup && field.fieldGroup.length > 0) {
        this._checkFields(field.formControl ? <FormGroup> field.formControl : form, field.fieldGroup, this.getParentModel(model, field), options);
      }
    });
  }

  private checkFieldExpressionChange(form: FormGroup | FormArray, field: FormlyFieldConfig, model: any, options: FormlyFormOptions) {
    if (!field || !field.expressionProperties) {
      return;
    }

    const expressionProperties = field.expressionProperties;
    const validators = FORMLY_VALIDATORS.map(v => `templateOptions.${v}`);

    for (const key in expressionProperties) {
      const expressionValue = evalExpression(
        expressionProperties[key].expression,
        { field },
        [model, options.formState],
      );

      if (
        expressionProperties[key].expressionValue !== expressionValue
        && (!isObject(expressionValue) || JSON.stringify(expressionValue) !== JSON.stringify(expressionProperties[key].expressionValue))
      ) {
        expressionProperties[key].expressionValue = expressionValue;
        evalExpression(
          expressionProperties[key].expressionValueSetter,
          { field },
          [expressionValue, model, field.templateOptions, field.validation, field],
        );

        if (key.indexOf('model.') === 0) {
          const path = key.replace(/^model\./, ''),
            formControl = field.key && key === path ? field.formControl : form.get(path);

          if (formControl) {
            formControl.patchValue(expressionValue);
          }
        }

        if (validators.indexOf(key) !== -1 && field.formControl) {
          field.formControl.updateValueAndValidity({ emitEvent: false });
        }
      }
    }
  }

  private checkFieldVisibilityChange(form: FormGroup | FormArray, field: FormlyFieldConfig, model: any, options: FormlyFormOptions) {
    if (!field || isNullOrUndefined(field.hideExpression)) {
      return;
    }

    const hideExpressionResult: boolean = !!evalExpression(
      field.hideExpression,
      { field },
      [model, options.formState],
    );

    if (hideExpressionResult !== field.hide) {
      // toggle hide
      field.hide = hideExpressionResult;
      field.templateOptions.hidden = hideExpressionResult;

      if (field.formControl && field.key) {
        const parent = this.fieldParentFormControl(form, field);
        if (parent) {
          if (hideExpressionResult === true && parent.get(this.fieldKey(field) as any)) {
            this.removeFieldControl(parent, field);
          } else if (hideExpressionResult === false && !parent.get(this.fieldKey(field) as any)) {
            this.addFieldControl(parent, field, model);
          }
        }
      }

      if (options.fieldChanges) {
        options.fieldChanges.next(<FormlyValueChangeEvent> { field: field, type: 'hidden', value: hideExpressionResult });
      }
    }
  }

  private addFieldControl(parent: FormArray | FormGroup, field: FormlyFieldConfig, model: any) {
    model = this.getFieldModel(model, field);
    if (field.formControl.value !== model) {
      field.formControl.patchValue(model, { emitEvent: false });
    }

    if (parent instanceof FormArray) {
      parent.push(field.formControl);
    } else if (parent instanceof FormGroup) {
      parent.addControl(this.fieldKey(field) as string, field.formControl);
    }
  }

  private getFieldModel(model: any, field: FormlyFieldConfig) {
    if (field.fieldGroup || field.fieldArray) {
      return model;
    }

    return getFieldModel(model, field, false);
  }

  private getParentModel(model: any, field: FormlyFieldConfig) {
    if (field.key && (field.fieldGroup || field.fieldArray)) {
      return getFieldModel(model, field, true);
    }
    return model;
  }

  private removeFieldControl(parent: FormArray | FormGroup, field: FormlyFieldConfig) {
    if (parent instanceof FormArray) {
      parent.removeAt(this.fieldKey(field) as number);
    } else if (parent instanceof FormGroup) {
      parent.removeControl(this.fieldKey(field) as string);
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
