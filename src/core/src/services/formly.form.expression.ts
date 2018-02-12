import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyValueChangeEvent } from '../components/formly.field.config';
import { evalExpression, FORMLY_VALIDATORS, getFieldModel } from '../utils';

/**
 * @internal
 */
@Injectable()
export class FormlyFormExpression {
  checkFields(form: FormGroup, fields: FormlyFieldConfig[] = [], model: any, options: FormlyFormOptions) {
    if (!this.canCheck(fields)) {
      return;
    }

    this._checkFields(form, fields, model, options);
  }

  private _checkFields(form: FormGroup, fields: FormlyFieldConfig[] = [], model: any, options: FormlyFormOptions) {
    fields.forEach(field => {
      this.checkFieldExpressionChange(form, field, this.fieldModel(model, field), options);
      this.checkFieldVisibilityChange(form, field, this.fieldModel(model, field), options);

      if (field.fieldGroup && field.fieldGroup.length > 0) {
        this._checkFields(field.formControl ? <FormGroup> field.formControl : form, field.fieldGroup, this.fieldModel(model, field), options);
      }
    });
  }

  private checkFieldExpressionChange(form: FormGroup, field: FormlyFieldConfig, model: any, options: FormlyFormOptions) {
    if (!field || !field.expressionProperties) {
      return;
    }

    const expressionProperties = field.expressionProperties;
    for (let key in expressionProperties) {
      const expressionValue = evalExpression(
        expressionProperties[key].expression,
        { field },
        [model, options.formState],
      );

      if (expressionProperties[key].expressionValue !== expressionValue) {
        expressionProperties[key].expressionValue = expressionValue;
        evalExpression(
          expressionProperties[key].expressionValueSetter,
          { field },
          [expressionValue, model, field.templateOptions, field.validation],
        );

        const validators = FORMLY_VALIDATORS.map(v => `templateOptions.${v}`);
        if (validators.indexOf(key) !== -1 && field.formControl) {
          field.formControl.updateValueAndValidity({ emitEvent: false });
        }
      }
    }

    const formControl = field.formControl;
    if (formControl) {
      if (formControl.status === 'DISABLED' && !field.templateOptions.disabled) {
        formControl.enable();
      }
      if (formControl.status !== 'DISABLED' && field.templateOptions.disabled) {
        formControl.disable();
      }
    }
  }

  private checkFieldVisibilityChange(form: FormGroup, field: FormlyFieldConfig, model: any, options: FormlyFormOptions) {
    if (!field || !field.hideExpression) {
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

        if (hideExpressionResult === true && form.get(field.key)) {
          this.removeFieldControl(parent, field);
        } else if (hideExpressionResult === false && !form.get(field.key)) {
          this.addFieldControl(parent, field, model);
        }
      }

      if (options.fieldChanges) {
        options.fieldChanges.next(<FormlyValueChangeEvent> { field: field, type: 'hidden', value: hideExpressionResult });
      }
    }
  }

  private fieldModel(model: any, field: FormlyFieldConfig) {
    if (field.key && (field.fieldGroup || field.fieldArray)) {
      return getFieldModel(model, field, true);
    }
    return model;
  }

  private addFieldControl(parent: FormArray | FormGroup, field: FormlyFieldConfig, fieldModel: any) {
    const model = (field.fieldGroup || field.fieldArray) ? fieldModel : getFieldModel(fieldModel, field, false);
    if (field.formControl.value !== model) {
      field.formControl.patchValue(model);
    }

    if (parent instanceof FormArray) {
      parent.push(field.formControl);
    } else if (parent instanceof FormGroup) {
      parent.addControl(this.fieldKey(field), field.formControl);
    }
  }

  private removeFieldControl(parent: FormArray | FormGroup, field: FormlyFieldConfig) {
    if (parent instanceof FormArray) {
      parent.removeAt(this.fieldKey as any);
    } else if (parent instanceof FormGroup) {
      parent.removeControl(this.fieldKey(field));
    }
  }

  private fieldParentFormControl(form: FormGroup, field: FormlyFieldConfig): FormArray | FormGroup {
    const paths = field.key.split('.');
    paths.pop(); // remove last path

    return (paths.length > 0 ? form.get(paths) : form) as any;
  }

  private fieldKey(field: FormlyFieldConfig) {
    return field.key.split('.').pop();
  }

  private canCheck(fields: any): boolean {
    return fields && fields['__build__'] && !fields['__build_child__'];
  }
}
