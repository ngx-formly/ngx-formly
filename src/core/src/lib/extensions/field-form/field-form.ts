import { FormlyExtension, FormlyFieldConfigCache } from '../../models';
import { FormGroup, FormControl, AbstractControlOptions, Validators } from '@angular/forms';
import { getFieldValue, defineHiddenProp } from '../../utils';
import { registerControl, findControl } from './utils';
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

    if (field.form && field.fieldGroup && !field.key) {
      defineHiddenProp(field, 'formControl', field.form);
    }
  }

  postPopulate(field: FormlyFieldConfigCache) {
    if (this.root !== field) {
      return;
    }

    this.root = null;
    const updateValidity = this.setValidators(field);
    updateValidity && (field.form as any)._updateTreeValidity();
  }

  private addFormControl(field: FormlyFieldConfigCache) {
    let control = findControl(field);
    if (!control) {
      const controlOptions: AbstractControlOptions = { updateOn: field.modelOptions.updateOn };
      control = field.fieldGroup
        ? new FormGroup({}, controlOptions)
        : new FormControl({ value: getFieldValue(field), disabled: false }, controlOptions);
    }

    registerControl(field, control);
  }

  private setValidators(field: FormlyFieldConfigCache) {
    let updateValidity = false;
    if (field.key) {
      const {
        formControl: c,
        templateOptions: { disabled },
      } = field;

      if (disabled && c.enabled) {
        c.disable({ emitEvent: false, onlySelf: true });
        updateValidity = true;
      }

      if (null === c.validator || null === c.asyncValidator) {
        c.setValidators(() => {
          const fields: FormlyFieldConfigCache[] =
            c['_fields'].length === 1 ? c['_fields'] : c['_fields'].filter(f => !f._hide);

          const v = Validators.compose(fields.map(f => f._validators));

          return v ? v(c) : null;
        });
        c.setAsyncValidators(() => {
          const fields: FormlyFieldConfigCache[] =
            c['_fields'].length === 1 ? c['_fields'] : c['_fields'].filter(f => !f._hide);

          const v = Validators.composeAsync(fields.map(f => f._asyncValidators));

          return v ? v(c) : of(null);
        });

        if (!c.parent) {
          c.updateValueAndValidity({ emitEvent: false });
        } else {
          updateValidity = true;
        }
      }
    }

    (field.fieldGroup || []).forEach(f => this.setValidators(f) && (updateValidity = true));

    return updateValidity;
  }
}
