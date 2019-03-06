import { FormlyExtension } from '../../services/formly.config';
import { FormlyFieldConfigCache } from '../../components/formly.field.config';
import { AbstractControl, FormGroup, FormArray, FormControl, AbstractControlOptions } from '@angular/forms';
import { getKeyPath, isNullOrUndefined, defineHiddenProp, getFieldValue } from '../../utils';

/** @experimental */
export class FieldFormExtension implements FormlyExtension {
  onPopulate(field: FormlyFieldConfigCache) {
    if (field.key && field.type) {
      const paths = getKeyPath(field);
      let rootForm = field.parent.formControl as FormGroup;
      paths.forEach((path, index) => {
        // FormGroup/FormArray only allow string value for path
        const formPath = path.toString();
        // is last item
        if (index === paths.length - 1) {
          this.addFormControl(rootForm, field, formPath, getFieldValue(field));
        } else {
          this.addFormControl(rootForm, { key: formPath, fieldGroup: [], modelOptions: {}, templateOptions: {} }, formPath, typeof path === 'string' ? {} : []);
          rootForm = <FormGroup> rootForm.get(formPath);
        }
      });
    }

    if (field.fieldGroup && !field.formControl) {
      field.formControl = field.parent.formControl;
    }
  }

  private addFormControl(form: FormGroup | FormArray, field: FormlyFieldConfigCache, path: string | number, value: any) {
    if (!field.formControl) {
      defineHiddenProp(field, 'formControl', field.formControl);
    }

    const abstractControlOptions = {
      validators: field._validators,
      asyncValidators: field._asyncValidators,
      updateOn: field.modelOptions.updateOn,
    } as AbstractControlOptions;
    let control: AbstractControl;

    if (field.formControl instanceof AbstractControl || form.get(<string> path)) {
      control = field.formControl || form.get(<string> path);
      if (
        !(isNullOrUndefined(control.value) && isNullOrUndefined(value))
        && control.value !== value
        && control instanceof FormControl
      ) {
        control.patchValue(value);
      }

      if (abstractControlOptions.validators || abstractControlOptions.asyncValidators) {
        if (abstractControlOptions.validators) {
          control.setValidators(abstractControlOptions.validators);
        }
        if (abstractControlOptions.asyncValidators) {
          control.setAsyncValidators(abstractControlOptions.asyncValidators);
        }
        control.updateValueAndValidity();
      }
    } else if (field._componentFactory && field._componentFactory.component && field._componentFactory.component.createControl) {
      const component = field._componentFactory.component;
      console.warn(`NgxFormly: '${component.name}::createControl' is deprecated since v5.0, use 'prePopulate' hook instead.`);
      control = component.createControl(value, field);
    } else if (field.fieldGroup && !field.fieldArray) {
      control = new FormGroup({}, abstractControlOptions);
    } else if (field.fieldArray) {
      control = new FormArray([], abstractControlOptions);
    } else {
      control = new FormControl(value, abstractControlOptions);
    }

    if (field.templateOptions.disabled) {
      control.disable();
    }

    // Replace decorated property with a getter that returns the observable.
    // https://github.com/angular-redux/store/blob/master/src/decorators/select.ts#L79-L85
    if (delete field.templateOptions.disabled) {
      Object.defineProperty(field.templateOptions, 'disabled', {
        get: () => !field.formControl.enabled,
        set: (value: boolean) => value ? field.formControl.disable() : field.formControl.enable(),
        enumerable: true,
        configurable: true,
      });
    }

    field.formControl = control;
    if (form instanceof FormArray) {
      if (form.at(<number> path) !== control) {
        form.setControl(<number> path, control);
      }
    } else {
      if (form.get(<string> path) !== control) {
        form.setControl(<string> path, control);
      }
    }
  }
}
