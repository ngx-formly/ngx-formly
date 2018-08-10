import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl, AbstractControl, Validators, AbstractControlOptions } from '@angular/forms';
import { FormlyConfig, FieldValidatorFn, TemplateManipulators } from './formly.config';
import { FormlyFieldConfig, FormlyFormOptions, FormlyFieldConfigCache } from '../components/formly.field.config';
import { FormlyFormExpression } from './formly.form.expression';
import { FORMLY_VALIDATORS, getFieldId, isObject, isNullOrUndefined, getKeyPath, getFieldModel, assignModelValue, isUndefined, getValueForKey, clone, removeFieldControl } from '../utils';

@Injectable({ providedIn: 'root' })
export class FormlyFormBuilder {
  private formId = 0;

  constructor(
    private formlyConfig: FormlyConfig,
    private formlyFormExpression: FormlyFormExpression,
  ) {}

  buildForm(form: FormGroup | FormArray, fields: FormlyFieldConfig[] = [], model: any, options: FormlyFormOptions) {
    const fieldTransforms = (options && options.fieldTransform) || this.formlyConfig.extras.fieldTransform;
    (Array.isArray(fieldTransforms) ? fieldTransforms : [fieldTransforms]).forEach(fieldTransform => {
      if (fieldTransform) {
        fields = fieldTransform(fields, model, form, options);
        if (!fields) {
          throw new Error('fieldTransform must return an array of fields');
        }
      }
    });

    this._buildForm({ fieldGroup: fields, model: model, formControl: form });
    this.formlyFormExpression.initFields(form, fields, model, options);
  }

  private _buildForm(root: FormlyFieldConfig) {
    this.formId++;
    root.fieldGroup.forEach((field, index) => {
      this.initFieldOptions(root, field, index);
      this.initFieldValidation(field);
      this.initFieldAsyncValidation(field);
      if (field.key && field.type) {
        const paths = getKeyPath({ key: field.key });
        let rootForm = root.formControl as FormGroup, rootModel = field.fieldGroup ? { [paths[0]]: field.model } : field.model;
        paths.forEach((path, index) => {
          // FormGroup/FormArray only allow string value for path
          const formPath = path.toString();
          // is last item
          if (index === paths.length - 1) {
            this.addFormControl(rootForm, field, rootModel, formPath);
            if (field.fieldGroup) {
              this._buildForm(field);
            }
          } else {
            let nestedForm = rootForm.get(formPath) as FormGroup;
            if (!nestedForm) {
              nestedForm = new FormGroup({});
              this.addControl(rootForm, formPath, nestedForm);
            }
            if (!rootModel[path]) {
              rootModel[path] = typeof path === 'string' ? {} : [];
            }

            rootForm = nestedForm;
            rootModel = rootModel[path];
          }
        });
      } else if (!field.key && field.fieldGroup) {
        field.formControl = root.formControl;
        this._buildForm(field);
      }
    });
  }

  private initFieldOptions(root: FormlyFieldConfig, field: FormlyFieldConfig, index: number) {
    Object.defineProperty(field, 'parent', { get: () => root, configurable: true });
    Object.defineProperty(field, 'model', {
      get: () => field.key && field.fieldGroup ? getFieldModel(root.model, field, true) : root.model,
      configurable: true,
    });
    if (!isUndefined(field.defaultValue) && isUndefined(getValueForKey(field.model, field.key))) {
      assignModelValue(field.model, field.key, field.defaultValue);
    }

    field.id = getFieldId(`formly_${this.formId}`, field, index);
    field.templateOptions = field.templateOptions || {};
    field.modelOptions = field.modelOptions || {};
    field.lifecycle = field.lifecycle || {};
    if (field.type && field.key) {
      field.templateOptions = Object.assign({
        label: '',
        placeholder: '',
        focus: false,
      }, field.templateOptions);
    }
    if (field.type) {
      this.formlyConfig.getMergedField(field);
    }

    this.initFieldWrappers(field);
    if (field.fieldArray) {
      this.initFieldArray(field);
    }

    if (field.fieldGroup) {
      if (!field.type) {
        field.type = 'formly-group';
      }
    }
  }

  private initFieldArray(field: FormlyFieldConfigCache) {
    field.fieldGroup = field.fieldGroup || [];
    if (field.fieldGroup.length > field.model.length) {
      for (let i = field.fieldGroup.length; i >= field.model.length; --i) {
        removeFieldControl(field.formControl as FormArray, i);
        field.fieldGroup.splice(i, 1);
      }
    }

    for (let i = field.fieldGroup.length; i < field.model.length; i++) {
      const f = { ...clone(field.fieldArray), key: `${i}` };
      field.fieldGroup.push(f);
    }
  }

  private addFormControl(form: FormGroup | FormArray, field: FormlyFieldConfigCache, model: any, path: string) {
    const abstractControlOptions = {
      validators: field._validators,
      asyncValidators: field._asyncValidators,
      updateOn: field.modelOptions.updateOn,
    } as AbstractControlOptions;
    let control: AbstractControl;

    if (field.formControl instanceof AbstractControl || form.get(path)) {
      control = field.formControl || form.get(path);
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
    } else if (field.component && field.component.createControl) {
      control = field.component.createControl(model[path], field);
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

    this.addControl(form, path, control, field);
  }

  private addControl(form: FormGroup | FormArray, key: string | number, formControl: AbstractControl, field?: FormlyFieldConfig) {
    if (field) {
      field.formControl = formControl;
    }

    if (form instanceof FormArray) {
      if (form.at(<number> key) !== formControl) {
        form.setControl(<number>key, formControl);
      }
    } else {
      if (form.get(<string> key) !== formControl) {
        form.setControl(<string>key, formControl);
      }
    }
  }

  private initFieldValidation(field: FormlyFieldConfigCache) {
    if (field._validators) {
      return;
    }

    field._validators = [];
    this.initPredefinedFieldValidation(field);
    if (field.validators) {
      for (const validatorName in field.validators) {
        if (validatorName !== 'validation') {
          let validator = field.validators[validatorName];
          let errorPath;
          let message;
          if (isObject(validator)) {
            errorPath = validator.errorPath;
            message = validator.message;
            validator = validator.expression;
          }

          field._validators.push((control: AbstractControl) => {
            const isValid = validator(control, field);
            if (errorPath && field.formControl && field.formControl.get(errorPath)) {
              if (!isValid) {
                field.formControl.get(errorPath).setErrors({
                  ...(field.formControl.get(errorPath).errors || {}),
                  [validatorName]: { message },
                });
              } else {
                const errors = (field.formControl.get(errorPath).errors || {});
                delete errors[validatorName];
                field.formControl.get(errorPath).setErrors(Object.keys(errors).length === 0 ? null : errors);
              }
            }

            return isValid ? null : { [validatorName]: errorPath ? { errorPath } : true };
          });
        } else {
          if (!Array.isArray(field.validators.validation)) {
            field.validators.validation = [field.validators.validation];
          }
          field.validators.validation
            .forEach((validator: any) => field._validators.push(this.wrapNgValidatorFn(field, validator)));
        }
      }
    }
  }

  private initFieldAsyncValidation(field: FormlyFieldConfigCache) {
    if (field._asyncValidators) {
      return;
    }

    field._asyncValidators = [];
    if (field.asyncValidators) {
      for (const validatorName in field.asyncValidators) {
        if (validatorName !== 'validation') {
          let validator = field.asyncValidators[validatorName];
          if (isObject(validator)) {
            validator = validator.expression;
          }

          field._asyncValidators.push((control: FormControl) => new Promise((resolve) => {
            return validator(control, field).then((result: boolean) => {
              resolve(result ? null : { [validatorName]: true });
            });
          }));
        } else {
          if (!Array.isArray(field.asyncValidators.validation)) {
            field.asyncValidators.validation = [field.asyncValidators.validation];
          }
          field.asyncValidators.validation
            .forEach((validator: any) => field._asyncValidators.push(this.wrapNgValidatorFn(field, validator) as any));
        }
      }
    }
  }

  private initPredefinedFieldValidation(field: FormlyFieldConfigCache) {
    FORMLY_VALIDATORS
      .filter(opt => field.templateOptions.hasOwnProperty(opt) || (field.expressionProperties && field.expressionProperties[`templateOptions.${opt}`]))
      .forEach((opt) => {
        field._validators.push((control: AbstractControl) => {
          const value = field.templateOptions[opt];
          if (value === false) {
            return null;
          }
          switch (opt) {
            case 'required':
              return Validators.required(control);
            case 'pattern':
              return Validators.pattern(value)(control);
            case 'minLength':
              return Validators.minLength(value)(control);
            case 'maxLength':
              return Validators.maxLength(value)(control);
            case 'min':
              return Validators.min(value)(control);
            case 'max':
              return Validators.max(value)(control);
          }
        });
      });
  }

  private wrapNgValidatorFn(field: FormlyFieldConfig, validator: string | FieldValidatorFn) {
    validator = typeof validator === 'string'
    ? this.formlyConfig.getValidator(validator).validation
    : validator;

    return (control: AbstractControl) => (validator as FieldValidatorFn)(control, field);
  }

  private initFieldWrappers(field: FormlyFieldConfig) {
    field.wrappers = field.wrappers || [];
    const fieldTemplateManipulators: TemplateManipulators = {
      preWrapper: [],
      postWrapper: [],
      ...(field.templateOptions.templateManipulators || {}),
    };

    field.wrappers = [
      ...this.formlyConfig.templateManipulators.preWrapper.map(m => m(field)),
      ...fieldTemplateManipulators.preWrapper.map(m => m(field)),
      ...field.wrappers,
      ...this.formlyConfig.templateManipulators.postWrapper.map(m => m(field)),
      ...fieldTemplateManipulators.postWrapper.map(m => m(field)),
    ].filter((el, i, a) => el && i === a.indexOf(el));
  }
}
