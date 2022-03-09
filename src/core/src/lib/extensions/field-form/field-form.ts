import { FormlyExtension, FormlyFieldConfigCache } from '../../models';
import {
  FormGroup,
  FormControl,
  AbstractControlOptions,
  Validators,
  ValidatorFn,
  AsyncValidatorFn,
} from '@angular/forms';
import { getFieldValue, defineHiddenProp, hasKey } from '../../utils';
import { registerControl, findControl, updateValidity } from './utils';
import { of } from 'rxjs';

export class FieldFormExtension implements FormlyExtension {
  private root: FormlyFieldConfigCache;
  prePopulate(field: FormlyFieldConfigCache) {
    if (!this.root) {
      this.root = field;
    }

    if (field.parent) {
      Object.defineProperty(field, 'form', {
        get: () => field.parent!.formControl,
        configurable: true,
      });
    }
  }

  onPopulate(field: FormlyFieldConfigCache) {
    if (field.hasOwnProperty('fieldGroup') && !hasKey(field)) {
      defineHiddenProp(field, 'formControl', field.form);
    } else {
      this.addFormControl(field);
    }
  }

  postPopulate(field: FormlyFieldConfigCache) {
    if (this.root !== field) {
      return;
    }

    this.root = null;
    const markForCheck = this.setValidators(field);
    if (markForCheck && field.parent) {
      let parent = field.parent;
      while (parent) {
        if (hasKey(parent) || !parent.parent) {
          updateValidity(parent.formControl, true);
        }
        parent = parent.parent;
      }
    }
  }

  private addFormControl(field: FormlyFieldConfigCache) {
    let control = findControl(field);
    if (!control) {
      const controlOptions: AbstractControlOptions = { updateOn: field.modelOptions.updateOn };

      if (field.fieldGroup) {
        control = new FormGroup({}, controlOptions);
      } else {
        const value = hasKey(field) ? getFieldValue(field) : field.defaultValue;
        control = new FormControl({ value, disabled: false }, { ...controlOptions, initialValueIsDefault: true });
      }
    }

    registerControl(field, control);
  }

  private setValidators(field: FormlyFieldConfigCache, disabled = false) {
    if (disabled === false && hasKey(field) && field.templateOptions?.disabled) {
      disabled = true;
    }

    let markForCheck = false;
    field.fieldGroup?.forEach((f) => f && this.setValidators(f, disabled) && (markForCheck = true));
    if (hasKey(field) || !field.parent || (!hasKey(field) && !field.fieldGroup)) {
      const { formControl: c } = field;
      if (c) {
        if (hasKey(field) && c instanceof FormControl) {
          if (disabled && c.enabled) {
            c.disable({ emitEvent: false, onlySelf: true });
            markForCheck = true;
          }

          if (!disabled && c.disabled) {
            c.enable({ emitEvent: false, onlySelf: true });
            markForCheck = true;
          }
        }

        if (null === c.validator || null === c.asyncValidator) {
          c.setValidators(() => {
            const v = Validators.compose(this.mergeValidators<ValidatorFn>(field, '_validators'));

            return v ? v(c) : null;
          });
          c.setAsyncValidators(() => {
            const v = Validators.composeAsync(this.mergeValidators<AsyncValidatorFn>(field, '_asyncValidators'));

            return v ? v(c) : of(null);
          });

          markForCheck = true;
        }

        if (markForCheck) {
          updateValidity(c, true);
        }
      }
    }

    return markForCheck;
  }

  private mergeValidators<T>(field: FormlyFieldConfigCache, type: '_validators' | '_asyncValidators'): T[] {
    const validators: any = [];
    const c = field.formControl;
    if (c?._fields?.length > 1) {
      c._fields
        .filter((f: FormlyFieldConfigCache) => !f._hide)
        .forEach((f: FormlyFieldConfigCache) => validators.push(...f[type]));
    } else if (field[type]) {
      validators.push(...field[type]);
    }

    if (field.fieldGroup) {
      field.fieldGroup
        .filter((f) => f?.fieldGroup && !hasKey(f))
        .forEach((f) => validators.push(...this.mergeValidators(f, type)));
    }

    return validators;
  }
}
