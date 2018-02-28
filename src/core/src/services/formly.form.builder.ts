import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';
import { FormlyConfig } from './formly.config';
import { FORMLY_VALIDATORS, evalStringExpression, evalExpressionValueSetter, getFieldId, assignModelValue, getValueForKey, isObject } from './../utils';
import { FormlyFieldConfig, FormlyFormOptions, FormlyValueChangeEvent } from '../components/formly.field.config';
import { getKeyPath, isUndefined, isFunction } from '../utils';
import { Subject } from 'rxjs/Subject';
import { FormlyFormExpression } from './formly.form.expression';

@Injectable()
export class FormlyFormBuilder {
  private formId = 0;

  constructor(
    private formlyConfig: FormlyConfig,
    private formlyFormExpression: FormlyFormExpression,
  ) {}

  buildForm(form: FormGroup | FormArray, fields: FormlyFieldConfig[] = [], model: any, options: FormlyFormOptions) {
    if (this.isBuilded(fields)) {
      return;
    }

    this.markAsBuilded(fields);
    this._buildForm(form, fields, model, options);
    this.formlyFormExpression.checkFields(form, fields, model, options);
  }

  private _buildForm(form: FormGroup | FormArray, fields: FormlyFieldConfig[] = [], model: any, options: FormlyFormOptions) {
    this.formId++;
    this.markAsBuilded(fields, true);

    options = options || {};
    options.formState = options.formState || {};
    if (!options.showError) {
      options.showError = this.formlyConfig.extras.showError;
    }
    if (!options.fieldChanges) {
      options.fieldChanges = new Subject<FormlyValueChangeEvent>();
    }

    let fieldTransforms = (options && options.fieldTransform) || this.formlyConfig.extras.fieldTransform;
    if (!Array.isArray(fieldTransforms)) {
      fieldTransforms = [fieldTransforms];
    }

    fieldTransforms.forEach(fieldTransform => {
      if (fieldTransform) {
        fields = fieldTransform(fields, model, form, options);
        if (!fields) {
          throw new Error('fieldTransform must return an array of fields');
        }
      }
    });

    this.registerFormControls(form, fields, model, options);
  }

  private registerFormControls(form: FormGroup | FormArray, fields: FormlyFieldConfig[], model: any, options: FormlyFormOptions) {
    fields.forEach((field, index) => {
      field.id = getFieldId(`formly_${this.formId}`, field, index);

      if (!isUndefined(field.defaultValue) && isUndefined(getValueForKey(model, field.key))) {
        assignModelValue(model, field.key, field.defaultValue);
      }
      this.initFieldOptions(field);
      this.initFieldExpression(field, model, options);
      this.initFieldValidation(field);
      this.initFieldAsyncValidation(field);

      if (field.key && field.type) {
        const paths = getKeyPath({ key: field.key });
        let rootForm = form, rootModel = model;
        paths.forEach((path, index) => {
          // FormGroup/FormArray only allow string value for path
          const formPath = path.toString();
          // is last item
          if (index === paths.length - 1) {
            this.addFormControl(rootForm, field, rootModel, formPath);
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
      }

      if (field.fieldGroup) {
        if (field.key) {
          this.addFormControl(form, field, { [field.key]: {} }, field.key);
          model[field.key] = model[field.key] || (field.fieldArray ? [] : {});
          this._buildForm(field.formControl as FormGroup, field.fieldGroup, model[field.key], options);
        } else {
          // if `hideExpression` is set in that case we have to deal
          // with toggle FormControl for each field in fieldGroup separately
          if (field.hideExpression) {
            field.fieldGroup.forEach(f => {
              let hideExpression: any = f.hideExpression || (() => false);
              if (typeof hideExpression === 'string') {
                hideExpression = evalStringExpression(hideExpression, ['model', 'formState']);
              }

              f.hideExpression = (model, formState) => field.hide || hideExpression(model, formState);
            });
          }
          this._buildForm(form, field.fieldGroup, model, options);
        }
      }
    });
  }

  private initFieldExpression(field: FormlyFieldConfig, model: any, options: FormlyFormOptions) {
    if (field.expressionProperties) {
      for (let key in field.expressionProperties as any) {
        if (typeof field.expressionProperties[key] === 'string' || isFunction(field.expressionProperties[key])) {
          // cache built expression
          field.expressionProperties[key] = {
            expression: isFunction(field.expressionProperties[key]) ? field.expressionProperties[key] : evalStringExpression(field.expressionProperties[key], ['model', 'formState']),
            expressionValueSetter: evalExpressionValueSetter(key, ['expressionValue', 'model', 'templateOptions', 'validation', 'field']),
          };
        }
      }
    }

    if (field.hideExpression) {
      if (typeof field.hideExpression === 'string') {
        // cache built expression
        field.hideExpression = evalStringExpression(field.hideExpression, ['model', 'formState']);
      }
    }
  }

  private initFieldOptions(field: FormlyFieldConfig) {
    field.templateOptions = field.templateOptions || {};
    if (field.type) {
      this.formlyConfig.getMergedField(field);
      if (field.key) {
        field.templateOptions = Object.assign({
          label: '',
          placeholder: '',
          focus: false,
        }, field.templateOptions);
      }
    }
  }

  private initFieldAsyncValidation(field: FormlyFieldConfig) {
    let validators: any = [];
    if (field.asyncValidators) {
      for (let validatorName in field.asyncValidators) {
        if (validatorName !== 'validation') {
          validators.push((control: FormControl) => {
            let validator = field.asyncValidators[validatorName];
            if (isObject(validator)) {
              validator = validator.expression;
            }

            return new Promise((resolve) => {
              return validator(control, field).then((result: boolean) => {
                resolve(result ? null : {[validatorName]: true});
              });
            });
          });
        }
      }
    }
    if (field.asyncValidators && Array.isArray(field.asyncValidators.validation)) {
      field.asyncValidators.validation.forEach((validate: any) => {
        if (typeof validate === 'string') {
          validators.push(this.formlyConfig.getValidator(validate).validation);
        } else {
          validators.push(validate);
        }
      });
    }

    if (validators.length) {
      if (field.asyncValidators && !Array.isArray(field.asyncValidators.validation)) {
        field.asyncValidators.validation = Validators.composeAsync([field.asyncValidators.validation, ...validators]);
      } else {
        field.asyncValidators = {
          validation: Validators.composeAsync(validators),
        };
      }
    }
  }

  private initFieldValidation(field: FormlyFieldConfig) {
    let validators: any = [];
    FORMLY_VALIDATORS
      .filter(opt => (field.templateOptions && field.templateOptions.hasOwnProperty(opt))
        || (field.expressionProperties && field.expressionProperties[`templateOptions.${opt}`]),
      )
      .forEach((opt) => {
        validators.push((control: FormControl) => {
          if (field.templateOptions[opt] === false) {
            return null;
          }

          return this.getValidation(opt, field.templateOptions[opt])(control);
        });
      });

    if (field.validators) {
      for (let validatorName in field.validators) {
        if (validatorName !== 'validation') {
          validators.push((control: FormControl) => {
            let validator = field.validators[validatorName];
            if (isObject(validator)) {
              validator = validator.expression;
            }

            return validator(control, field) ? null : {[validatorName]: true};
          });
        }
      }
    }

    if (field.validators && Array.isArray(field.validators.validation)) {
      field.validators.validation.forEach((validate: any) => {
        if (typeof validate === 'string') {
          validators.push(this.formlyConfig.getValidator(validate).validation);
        } else {
          validators.push(validate);
        }
      });
    }

    if (validators.length) {
      if (field.validators && !Array.isArray(field.validators.validation)) {
        field.validators.validation = Validators.compose([field.validators.validation, ...validators]);
      } else {
        field.validators = {
          validation: Validators.compose(validators),
        };
      }
    }
  }

  private addFormControl(form: FormGroup | FormArray, field: FormlyFieldConfig, model: any, path: string) {
    let control: AbstractControl;
    if (field.formControl instanceof AbstractControl) {
      control = field.formControl;
    } else if (form.get(path)) {
      control = form.get(path);
    } else if (field.component && field.component.createControl) {
      control = field.component.createControl(model[path], field);
    } else if (field.fieldGroup && field.key && field.key === path && !field.fieldArray) {
      control = new FormGroup(
        model[path],
        field.validators ? field.validators.validation : undefined,
        field.asyncValidators ? field.asyncValidators.validation : undefined,
      );
    } else if (field.fieldArray && field.key && field.key === path) {
      control = new FormArray(
        [],
        field.validators ? field.validators.validation : undefined,
        field.asyncValidators ? field.asyncValidators.validation : undefined,
      );
    } else {
      control = new FormControl(
        model[path],
        field.validators ? field.validators.validation : undefined,
        field.asyncValidators ? field.asyncValidators.validation : undefined,
      );
    }

    if (field.templateOptions.disabled) {
      control.disable();
    }

    this.addControl(form, path, control, field);
  }

  private addControl(form: FormGroup | FormArray, key: string | number, formControl: AbstractControl, field?: FormlyFieldConfig) {
    if (field) {
      field.formControl = formControl;
    }

    if (form instanceof FormArray) {
      form.insert(<number>key, formControl);
    } else {
      if (formControl instanceof FormArray) {
        form.setControl(<string>key, formControl);
      } else {
        form.addControl(<string>key, formControl);
      }
    }

  }

  private getValidation(opt: string, value: any) {
    switch (opt) {
      case 'required':
        return Validators.required;
      case 'pattern':
        return Validators.pattern(value);
      case 'minLength':
        return Validators.minLength(value);
      case 'maxLength':
        return Validators.maxLength(value);
      case 'min':
        return Validators.min(value);
      case 'max':
        return Validators.max(value);
    }
  }

  /* to avoid rebuild fields */
  private isBuilded(fields: any): boolean {
    return fields && (!!fields['__build__'] || !!fields['__build_child__']);
  }

  private markAsBuilded(fields: any, isChild = false) {
    if (this.isBuilded(fields)) {
      return;
    }

    fields[`__build${isChild ? '_child' : ''}__`] = true;
  }
}
