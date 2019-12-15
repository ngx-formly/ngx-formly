import { FormlyExtension, FormlyFieldConfigCache } from '../../models';
import { FormGroup, FormControl, AbstractControlOptions } from '@angular/forms';
import { getKeyPath, getFieldValue, defineHiddenProp } from '../../utils';
import { registerControl } from './utils';

/** @experimental */
export class FieldFormExtension implements FormlyExtension {
  prePopulate(field: FormlyFieldConfigCache) {
    if (field.parent) {
      Object.defineProperty(field, 'form', {
        get: () => field.parent.formControl,
        configurable: true,
      });
    }
  }

  onPopulate(field: FormlyFieldConfigCache) {
    if (field.key) {
      this.addFormControl(field);
    }

    if (field.form && field.hasOwnProperty('fieldGroup') && !field.key) {
      defineHiddenProp(field, 'formControl', field.form);
    }
  }

  postPopulate(field: FormlyFieldConfigCache) {
    if (field.parent) {
      return;
    }

    const updateValidity = this.setValidators(field);
    updateValidity && (field.form as any)._updateTreeValidity({ emitEvent: false });
  }

  private addFormControl(field: FormlyFieldConfigCache) {
    let control = field.formControl || field.form.get(getKeyPath(field));
    if (!control) {
      const controlOptions: AbstractControlOptions = { updateOn: field.modelOptions.updateOn };
      control = field.fieldGroup
        ? new FormGroup({}, controlOptions)
        : new FormControl({ value: getFieldValue(field) }, controlOptions);
    }

    registerControl(field, control);
  }

  private setValidators(field: FormlyFieldConfigCache) {
    let updateValidity = false;
    if (field.key || !field.parent) {
      const {
        formControl: control,
        templateOptions: { disabled },
      } = field;

      if (disabled && control.enabled) {
        control.disable({ emitEvent: false, onlySelf: true });
        updateValidity = true;
      }

      if (field._validators !== control.validator) {
        control.setValidators(this.mergeValidators(field, '_validators'));
        field._validators = control.validator;
        updateValidity = true;
      }
      if (field._asyncValidators !== control.asyncValidator) {
        control.setAsyncValidators(this.mergeValidators(field, '_asyncValidators'));
        field._asyncValidators = control.asyncValidator;
        updateValidity = true;
      }
    }

    (field.fieldGroup || []).forEach(f => this.setValidators(f) && (updateValidity = true));

    return updateValidity;
  }

  private mergeValidators(field: FormlyFieldConfigCache, type: '_validators' | '_asyncValidators') {
    const validators: any = field[type];
    if (field.fieldGroup) {
      field.fieldGroup
        .filter(f => !f.key && f.fieldGroup)
        .forEach(f => validators.push(...this.mergeValidators(f, type)));
    }

    return validators;
  }
}
