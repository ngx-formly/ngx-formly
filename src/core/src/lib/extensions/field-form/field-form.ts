import { FormlyExtension } from '../../services/formly.config';
import { FormlyFieldConfigCache } from '../../components/formly.field.config';
import { FormGroup, FormControl, AbstractControlOptions } from '@angular/forms';
import { getKeyPath, getFieldValue, defineHiddenProp } from '../../utils';
import { registerControl } from './utils';

/** @experimental */
export class FieldFormExtension implements FormlyExtension {
  prePopulate(field: FormlyFieldConfigCache) {
    Object.defineProperty(field, 'form', {
      get: () => (field.parent ? field.parent.formControl : field.formControl),
      configurable: true,
    });
  }

  onPopulate(field: FormlyFieldConfigCache) {
    if (!field.parent) {
      return;
    }

    if (field.key) {
      this.addFormControl(field);
    }

    if (field.form && field.fieldGroup && !field.key) {
      defineHiddenProp(field, 'formControl', field.form);
    }
  }

  postPopulate(field: FormlyFieldConfigCache) {
    if (field.parent) {
      return;
    }

    const updateValidity = this.setValidators(field);
    updateValidity && (field.formControl as any)._updateTreeValidity({ emitEvent: false });
  }

  private addFormControl(field: FormlyFieldConfigCache) {
    let control = field.formControl || field.form.get(getKeyPath(field));
    if (!control) {
      const controlOptions: AbstractControlOptions = { updateOn: field.modelOptions.updateOn };
      control = field.fieldGroup
        ? new FormGroup({}, controlOptions)
        : new FormControl(getFieldValue(field), controlOptions);
    }

    registerControl(field, control);
  }

  private setValidators(field: FormlyFieldConfigCache) {
    let updateValidity = false;
    if (field.key) {
      const {
        _validators: validators,
        _asyncValidators: asyncValidators,
        formControl: control,
        templateOptions: { disabled },
      } = field;

      if (disabled && control.enabled) {
        control.disable({ emitEvent: false, onlySelf: true });
        updateValidity = true;
      }

      if (validators !== control.validator) {
        control.setValidators(validators);
        updateValidity = true;
      }
      if (asyncValidators !== control.asyncValidator) {
        control.setAsyncValidators(asyncValidators);
        updateValidity = true;
      }
    }

    (field.fieldGroup || []).forEach(f => this.setValidators(f) && (updateValidity = true));

    return updateValidity;
  }
}
