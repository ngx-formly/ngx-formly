import { FormlyExtension, FormlyFieldConfigCache } from '../../models';
import {
  FormGroup,
  FormControl,
  AbstractControlOptions,
  Validators,
  ValidatorFn,
  AsyncValidatorFn,
} from '@angular/forms';
import { getFieldValue, defineHiddenProp } from '../../utils';
import { registerControl, findControl, updateValidity as updateControlValidity } from './utils';
import { of } from 'rxjs';

/** @experimental */
export class FieldFormExtension implements FormlyExtension {
  private root: FormlyFieldConfigCache;
  prePopulate(field: FormlyFieldConfigCache) {
    if (!this.root) {
      this.root = field;
    }

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

    if (field.hasOwnProperty('fieldGroup') && !field.key) {
      if (field.form) {
        defineHiddenProp(field, 'formControl', field.form);
      }
    } else {
      this.addFormControl(field);
    }
  }

  postPopulate(field: FormlyFieldConfigCache) {
    if (this.root !== field) {
      return;
    }

    this.root = null;
    const fieldsToUpdate = this.setValidators(field);
    if (fieldsToUpdate.length === 0) {
      return;
    }

    if (fieldsToUpdate.length === 1) {
      let control = fieldsToUpdate[0].formControl;
      while (control) {
        (control as any)._updateTreeValidity({ onlySelf: true });
        control = control.parent;
      }
    } else {
      (field.form as any)._updateTreeValidity();
    }
  }

  private addFormControl(field: FormlyFieldConfigCache) {
    let control = findControl(field);
    if (!control) {
      const controlOptions: AbstractControlOptions = { updateOn: field.modelOptions.updateOn };

      if (field.fieldGroup) {
        control = new FormGroup({}, controlOptions);
      } else {
        const value = field.key ? getFieldValue(field) : field.defaultValue;
        control = new FormControl({ value: getFieldValue(field), disabled: false }, controlOptions);
      }
    }

    registerControl(field, control);
  }

  private setValidators(field: FormlyFieldConfigCache) {
    let updateValidity = false;
    if (field.key || !field.parent || (!field.key && !field.fieldGroup)) {
      const { formControl: c } = field;
      const disabled = field.templateOptions ? field.templateOptions.disabled : false;
      if (field.key && c) {
        if (disabled && c.enabled) {
          c.disable({ emitEvent: false, onlySelf: true });
          if (!c.parent) {
            updateControlValidity(c);
          } else {
            updateValidity = true;
          }
        }

        if (!disabled && c.disabled) {
          c.enable({ emitEvent: false, onlySelf: true });
          if (!c.parent) {
            updateControlValidity(c);
          } else {
            updateValidity = true;
          }
        }
      }


      if (c && (null === c.validator || null === c.asyncValidator)) {
        c.setValidators(() => {
          const v = Validators.compose(this.mergeValidators<ValidatorFn>(field, '_validators'));

          return v ? v(c) : null;
        });
        c.setAsyncValidators(() => {
          const v = Validators.composeAsync(this.mergeValidators<AsyncValidatorFn>(field, '_asyncValidators'));

          return v ? v(c) : of(null);
        });

        if (!c.parent) {
          updateControlValidity(c);
        } else {
          updateValidity = true;
        }
      }
    }

    const fieldsToUpdate = updateValidity ? [field] : [];
    (field.fieldGroup || []).forEach(f => {
      if (f) {
        const childrenToUpdate = this.setValidators(f);
        if (!updateValidity) {
          fieldsToUpdate.push(...childrenToUpdate);
        }
      }
    });

    return fieldsToUpdate;
  }

  private mergeValidators<T>(field: FormlyFieldConfigCache, type: '_validators' | '_asyncValidators'): T[] {
    const validators: any = [];
    const c = field.formControl;
    if (c && c['_fields'] && c['_fields'].length > 1) {
      c['_fields']
        .filter((f: FormlyFieldConfigCache) => !f._hide)
        .forEach((f: FormlyFieldConfigCache) => validators.push(...f[type]));
    } else if (field[type]) {
      validators.push(...field[type]);
    }

    if (field.fieldGroup) {
      field.fieldGroup
        .filter((f) => f && !f.key && f.fieldGroup)
        .forEach((f) => validators.push(...this.mergeValidators(f, type)));
    }

    return validators;
  }
}
