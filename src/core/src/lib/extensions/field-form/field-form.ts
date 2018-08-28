import { FormlyExtension } from '../../services/formly.config';
import { FormlyFieldConfigCache } from '../../components/formly.field.config';
import { AbstractControl, FormGroup, FormArray, FormControl, AbstractControlOptions } from '@angular/forms';
import { getKeyPath, isNullOrUndefined } from '../../utils';

export class FieldFormExtension implements FormlyExtension {
  onPopulate(field: FormlyFieldConfigCache) {
    if (field.key && field.type) {
      const paths = getKeyPath({ key: field.key });
      let rootForm = field.parent.formControl as FormGroup, rootModel = field.fieldGroup ? { [paths[0]]: field.model } : field.model;
      paths.forEach((path, index) => {
        // FormGroup/FormArray only allow string value for path
        const formPath = path.toString();
        // is last item
        if (index === paths.length - 1) {
          this.addFormControl(rootForm, field, rootModel, formPath);
        } else {
          if (!rootModel[path]) {
            rootModel[path] = typeof path === 'string' ? {} : [];
          }
          this.addFormControl(rootForm, { key: formPath, fieldGroup: [], modelOptions: {}, templateOptions: {} }, rootModel, formPath);

          rootForm = <FormGroup> rootForm.get(formPath);
          rootModel = rootModel[path];
        }
      });
    }

    if (field.fieldGroup && !field.formControl) {
      field.formControl = field.parent.formControl;
    }
  }

  private addFormControl(form: FormGroup | FormArray, field: FormlyFieldConfigCache, model: any, path: string | number) {
    const abstractControlOptions = {
      validators: field._validators,
      asyncValidators: field._asyncValidators,
      updateOn: field.modelOptions.updateOn,
    } as AbstractControlOptions;
    let control: AbstractControl;

    if (field.formControl instanceof AbstractControl || form.get(<string> path)) {
      control = field.formControl || form.get(<string> path);
      if (
        !(isNullOrUndefined(control.value) && isNullOrUndefined(model[path]))
        && control.value !== model[path]
        && control instanceof FormControl
      ) {
        control.patchValue(model[path]);
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
    } else if ((<any> field).component && (<any> field).component.createControl) {
      control = (<any> field).component.createControl(model[path], field);
    } else if (field.fieldGroup && !field.fieldArray) {
      control = new FormGroup({}, abstractControlOptions);
    } else if (field.fieldArray) {
      control = new FormArray([], abstractControlOptions);
    } else {
      control = new FormControl(model[path], abstractControlOptions);
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

    if (field) {
      field.formControl = control;
    }

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
