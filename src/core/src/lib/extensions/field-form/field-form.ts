import { FormlyExtension, FormlyFieldConfigCache } from '../../models';
import {
  FormGroup,
  FormControl,
  AbstractControlOptions,
  Validators,
  ValidatorFn,
  AsyncValidatorFn,
} from '@angular/forms';
import { getFieldValue, defineHiddenProp, isNil } from '../../utils';
import { registerControl, findControl, updateValidity } from './utils';
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
    if (field.hasOwnProperty('fieldGroup') && isNil(field.key)) {
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
    this.setValidators(field);
  }

  private addFormControl(field: FormlyFieldConfigCache) {
    let control = findControl(field);
    if (!control) {
      const controlOptions: AbstractControlOptions = { updateOn: field.modelOptions.updateOn };

      if (field.fieldGroup) {
        control = new FormGroup({}, controlOptions);
      } else {
        const value = !isNil(field.key) ? getFieldValue(field) : field.defaultValue;
        control = new FormControl({ value, disabled: false }, controlOptions);
      }
    }

    registerControl(field, control);
  }

  private setValidators(field: FormlyFieldConfigCache) {
    let markForCheck = false;
    field.fieldGroup?.forEach((f) => f && this.setValidators(f) && (markForCheck = true));

    if (!isNil(field.key) || !field.parent || (isNil(field.key) && !field.fieldGroup)) {
      const { formControl: c } = field;
      const disabled = field.templateOptions ? field.templateOptions.disabled : false;
      if (field.key && c) {
        if (disabled && c.enabled) {
          c.disable({ emitEvent: false, onlySelf: true });
          markForCheck = true;
        }

        if (!disabled && c.disabled) {
          c.enable({ emitEvent: false, onlySelf: true });
          markForCheck = true;
        }
      }

      if (c && (null === c.validator || null === c.asyncValidator)) {
        c.setValidators(() => {
          const v = Validators.compose(this.mergeValidators<ValidatorFn>(field, '_validators'));

          return v?.(c);
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

    return markForCheck;
  }

  private mergeValidators<T>(field: FormlyFieldConfigCache, type: '_validators' | '_asyncValidators'): T[] {
    const validators: any = [];
    const c = field.formControl;
    if (c?.['_fields']?.length > 1) {
      c['_fields']
        .filter((f: FormlyFieldConfigCache) => !f._hide)
        .forEach((f: FormlyFieldConfigCache) => validators.push(...f[type]));
    } else if (field[type]) {
      validators.push(...field[type]);
    }

    if (field.fieldGroup) {
      field.fieldGroup
        .filter((f) => f?.fieldGroup && isNil(f.key))
        .forEach((f) => validators.push(...this.mergeValidators(f, type)));
    }

    return validators;
  }
}
