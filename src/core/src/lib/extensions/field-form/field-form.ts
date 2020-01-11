import { FormlyExtension } from '../../services/formly.config';
import { FormlyFieldConfigCache } from '../../components/formly.field.config';
import { FormGroup, FormControl, AbstractControlOptions, Validators } from '@angular/forms';
import { getFieldValue, defineHiddenProp } from '../../utils';
import { registerControl, findControl } from './utils';
import { of } from 'rxjs';

/** @experimental */
export class FieldFormExtension implements FormlyExtension {
  onPopulate(field: FormlyFieldConfigCache) {
    if (field.key) {
      this.addFormControl(field);
    }

    if (field.parent && field.fieldGroup && !field.key) {
      defineHiddenProp(field, 'formControl', field.parent.formControl);
    }
  }

  postPopulate(field: FormlyFieldConfigCache) {
    if (field.parent) {
      return;
    }

    const updateValidity = this.setValidators(field);
    updateValidity && (field.formControl as any)._updateTreeValidity();
  }

  private addFormControl(field: FormlyFieldConfigCache) {
    let control = findControl(field);
    if (!control) {
      const controlOptions: AbstractControlOptions = { updateOn: field.modelOptions.updateOn };
      const value = getFieldValue(field);
      if (field._componentFactory && field._componentFactory.component && field._componentFactory.component.createControl) {
        const component = field._componentFactory.component;
        console.warn(`NgxFormly: '${component.name}::createControl' is deprecated since v5.0, use 'prePopulate' hook instead.`);
        control = component.createControl(value, field);
      } else if (field.fieldGroup) {
        // TODO: move to postPopulate
        control = new FormGroup({}, controlOptions);
      } else {
        control = new FormControl(value, controlOptions);
      }
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
          const fields: FormlyFieldConfigCache[] = c['_fields'].length === 1
            ? c['_fields']
            : c['_fields'].filter(f => !f._hide);

          const v = Validators.compose(fields.map(f => f._validators));

          return v ? v(c) : null;
        });
        c.setAsyncValidators(() => {
          const fields: FormlyFieldConfigCache[] = c['_fields'].length === 1
            ? c['_fields']
            : c['_fields'].filter(f => !f._hide);

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
