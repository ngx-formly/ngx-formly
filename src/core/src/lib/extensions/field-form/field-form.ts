import { FormlyExtension, FormlyConfig } from '../../services/formly.config';
import { FormlyFieldConfigCache } from '../../components/formly.field.config';
import { FormGroup, FormControl, AbstractControlOptions, Validators, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { getFieldValue, defineHiddenProp } from '../../utils';
import { registerControl, findControl, updateValidity as updateControlValidity } from './utils';
import { of } from 'rxjs';

/** @experimental */
export class FieldFormExtension implements FormlyExtension {
  constructor(private config: FormlyConfig) { }

  onPopulate(field: FormlyFieldConfigCache) {
    if (!field.parent) {
      return;
    }

    if (field.fieldGroup && !field.key) {
      defineHiddenProp(field, 'formControl', field.parent.formControl);
    } else {
      this.addFormControl(field);
    }
  }

  postPopulate(field: FormlyFieldConfigCache) {
    if (field.parent) {
      return;
    }

    const fieldsToUpdate = this.setValidators(field);
    if (fieldsToUpdate.length === 0) {
      return;
    }

    if (fieldsToUpdate.length === 1) {
      fieldsToUpdate[0].formControl.updateValueAndValidity();
    } else {
      (field.formControl as any)._updateTreeValidity();
    }
  }

  private addFormControl(field: FormlyFieldConfigCache) {
    let control = findControl(field);
    if (!control) {
      const controlOptions: AbstractControlOptions = { updateOn: field.modelOptions.updateOn };
      const value = field.key ? getFieldValue(field) : field.defaultValue;

      const ref = this.config ? this.config.resolveFieldTypeRef(field) : null;
      if (ref && ref.componentType && ref.componentType['createControl']) {
        const component = ref.componentType;
        console.warn(`NgxFormly: '${component.name}::createControl' is deprecated since v5.0, use 'prePopulate' hook instead.`);
        control = component['createControl'](value, field);
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
    if (field.key || !field.parent || (!field.key && !field.fieldGroup)) {
      const { formControl: c } = field;
      const disabled = field.templateOptions ? field.templateOptions.disabled : false;
      if (disabled && c.enabled) {
        c.disable({ emitEvent: false, onlySelf: true });
        if (!c.parent) {
          updateControlValidity(c);
        } else {
          updateValidity = true;
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

        if (!c.parent) {
          updateControlValidity(c);
        } else {
          updateValidity = true;
        }
      }
    }

    const fieldsToUpdate = updateValidity ? [field] : [];
    (field.fieldGroup || []).forEach(f => {
      const childrenToUpdate = this.setValidators(f);
      if (!updateValidity) {
        fieldsToUpdate.push(...childrenToUpdate);
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
    } else {
      validators.push(...field[type]);
    }

    if (field.fieldGroup) {
      field.fieldGroup
        .filter(f => !f.key && f.fieldGroup)
        .forEach(f => validators.push(...this.mergeValidators(f, type)));
    }

    return validators;
  }
}
