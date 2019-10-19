import { FormlyExtension } from '../../services/formly.config';
import { FormlyFieldConfigCache } from '../../components/formly.field.config';
import { FormGroup, FormControl, AbstractControlOptions } from '@angular/forms';
import { getKeyPath, getFieldValue, defineHiddenProp } from '../../utils';
import { registerControl } from './utils';

/** @experimental */
export class FieldFormExtension implements FormlyExtension {
  prePopulate(field: FormlyFieldConfigCache) {
    Object.defineProperty(field, 'form', {
      get: () => field.parent ? field.parent.formControl : field.formControl,
      configurable: true,
    });
  }

  onPopulate(field: FormlyFieldConfigCache) {
    // TODO: add an option to skip extension
    if (!field.parent || field.fieldArray) {
      return;
    }

    if (field.key) {
      this.addFormControl(field);
    }

    if (field.form && field.fieldGroup && !field.key) {
      defineHiddenProp(field, 'formControl', field.form);
    }
  }

  private addFormControl(field: FormlyFieldConfigCache) {
    const controlOptions: AbstractControlOptions = {
      validators: field._validators,
      asyncValidators: field._asyncValidators,
      updateOn: field.modelOptions.updateOn,
    };

    const form = field.form;
    const value = getFieldValue(field);
    const paths = getKeyPath(field);
    let control = field.formControl || (form && form.get(paths));
    if (control) {
      let shouldUpdateValidity = false;
      if (controlOptions.validators !== control.validator) {
        shouldUpdateValidity = true;
        control.setValidators(controlOptions.validators);
      }

      if (controlOptions.asyncValidators !== control.asyncValidator) {
        shouldUpdateValidity = true;
        control.setAsyncValidators(controlOptions.asyncValidators);
      }

      if (shouldUpdateValidity && control.parent) {
        control.updateValueAndValidity();
      }
    } else if (field.fieldGroup) {
      // TODO: move to postPopulate
      control = new FormGroup({}, controlOptions);
    } else {
      control = new FormControl(value, controlOptions);
    }

    registerControl(field, control);
  }
}
