import { FormlyExtension } from '../../services/formly.config';
import { FormlyFieldConfigCache } from '../../components/formly.field.config';
import { AbstractControl, FormGroup, FormControl, AbstractControlOptions } from '@angular/forms';
import { getKeyPath, getFieldValue, defineHiddenProp } from '../../utils';
import { registerControl } from './utils';

/** @experimental */
export class FieldFormExtension implements FormlyExtension {
  onPopulate(field: FormlyFieldConfigCache) {
    // TODO: add an option to skip extension
    if (field.fieldArray) {
      return;
    }

    if (field.key && field.type) {
      this.addFormControl(field);
    }

    if (field.parent && field.fieldGroup && !field.key) {
      defineHiddenProp(field, 'formControl', field.parent.formControl);
    }
  }

  private addFormControl(field: FormlyFieldConfigCache) {
    const controlOptions: AbstractControlOptions = {
      validators: field._validators,
      asyncValidators: field._asyncValidators,
      updateOn: field.modelOptions.updateOn,
    };
    let control: AbstractControl;

    const form = field.parent.formControl as FormGroup;
    const value = getFieldValue(field);
    const paths = getKeyPath(field);
    if (field.formControl instanceof AbstractControl || (form && form.get(paths))) {
      control = field.formControl || form.get(paths);
      if (
        (controlOptions.validators !== control.validator)
        || (controlOptions.asyncValidators !== control.asyncValidator)
      ) {
        if (controlOptions.validators !== control.validator) {
          control.setValidators(controlOptions.validators);
        }
        if (controlOptions.asyncValidators !== control.asyncValidator) {
          control.setAsyncValidators(controlOptions.asyncValidators);
        }
        control.updateValueAndValidity();
      }
    } else if (field._componentFactory && field._componentFactory.component && field._componentFactory.component.createControl) {
      const component = field._componentFactory.component;
      console.warn(`NgxFormly: '${component.name}::createControl' is deprecated since v5.0, use 'prePopulate' hook instead.`);
      control = component.createControl(value, field);
    } else if (field.fieldGroup) {
      // TODO: move to postPopulate
      control = new FormGroup({}, controlOptions);
    } else {
      control = new FormControl(value, controlOptions);
    }

    registerControl(field, control);
  }
}
