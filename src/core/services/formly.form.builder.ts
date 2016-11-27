import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { FormlyConfig } from './formly.config';
import { evalStringExpression, evalExpressionValueSetter, getFieldId, assignModelValue, isObject } from './../utils';
import { FormlyFieldConfig } from '../components/formly.field.config';

@Injectable()
export class FormlyFormBuilder {
  private defaultPath;
  private validationOpts = ['required', 'pattern', 'minLength', 'maxLength', 'min', 'max'];
  private formId = 0;
  private model;

  constructor(private formlyConfig: FormlyConfig) {}

  buildForm(form: FormGroup, fields: FormlyFieldConfig[] = [], model, options) {
    this.model = model;
    this.formId++;
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

  private registerFormControls(form: FormGroup, fields: FormlyFieldConfig[], model, options) {
    fields.map((field, index) => {
      field.id = getFieldId(`formly_${this.formId}`, field, index);
      if (field.key && field.type) {
        this.initFieldTemplateOptions(field);
        this.initFieldValidation(field);
        this.initFieldAsyncValidation(field);


        let path: any = field.key;
        if (typeof path === 'string') {
          if (field.defaultValue) {
            this.defaultPath = path;
          }
          path = path.split('.');
        }

        if (path.length > 1) {
          const rootPath = path.shift();
          let nestedForm = <FormGroup>(form.get(rootPath) ? form.get(rootPath) : new FormGroup({}, field.validators ? field.validators.validation : undefined, field.asyncValidators ? field.asyncValidators.validation : undefined));
          if (!form.get(field.key)) {
            form.addControl(rootPath, nestedForm);
          }
          if (!model[rootPath]) {
            model[rootPath] = isNaN(rootPath) ? {} : [];
          }

          const originalKey = field.key;
          field.key = path;
          this.buildForm(nestedForm, [field], model[rootPath], {});
          field.key = originalKey;
        } else {

          this.formlyConfig.getMergedField(field);
          this.initFieldExpression(field);
          this.initFieldValidation(field);
          this.initFieldAsyncValidation(field);
          this.addFormControl(form, field, model[path[0]] || field.defaultValue || '');
          if (field.defaultValue && !model[path[0]]) {
            assignModelValue(this.model, this.defaultPath, field.defaultValue);
            this.defaultPath = undefined;
          }
        }
      }

      if (field.fieldGroup) {
        if (field.key) {
          let nestedForm = <FormGroup>form.get(field.key),
            nestedModel = model[field.key] || {};

          if (!nestedForm) {
            nestedForm = new FormGroup(
              {},
              field.validators ? field.validators.validation : undefined,
              field.asyncValidators ? field.asyncValidators.validation : undefined,
            );
            form.addControl(field.key, nestedForm);
          }

          this.buildForm(nestedForm, field.fieldGroup, nestedModel, {});
        } else {
          this.buildForm(form, field.fieldGroup, model, {});
        }
      }

      if (field.fieldArray && field.key) {
        const arrayForm = new FormArray(
          [],
          field.validators ? field.validators.validation : undefined,
          field.asyncValidators ? field.asyncValidators.validation : undefined,
        );
        form.setControl(field.key, arrayForm);
      }
    });
  }

  private initFieldExpression(field: FormlyFieldConfig) {
    if (field.expressionProperties) {
      for (let key in field.expressionProperties) {
        if (typeof field.expressionProperties[key] === 'string') {
          // cache built expression
          field.expressionProperties[key] = {
            expression: evalStringExpression(field.expressionProperties[key], ['model', 'formState']),
            expressionValueSetter: evalExpressionValueSetter(key, ['expressionValue', 'model', 'templateOptions', 'validation']),
          };
        }
      }
    }

    if (typeof field.hideExpression === 'string') {
      // cache built expression
      field.hideExpression = evalStringExpression(field.hideExpression, ['model', 'formState']);
    }
  }

  private initFieldTemplateOptions(field: FormlyFieldConfig) {
    field.templateOptions = Object.assign({
      label: '',
      placeholder: '',
      focus: false,
    }, field.templateOptions);
  }

  private initFieldAsyncValidation(field: FormlyFieldConfig) {
    let validators = [];
    if (field.asyncValidators) {
      for (let validatorName in field.asyncValidators) {
        if (validatorName !== 'validation') {
          validators.push((control: FormControl) => {
            let validator = field.asyncValidators[validatorName];
            if (isObject(validator)) {
              validator = validator.expression;
            }

            return new Promise((resolve) => {
              return validator(control).then(result => {
                resolve(result ? null : {[validatorName]: true});
              });
            });
          });
        }
      }
    }
    if (field.asyncValidators && Array.isArray(field.asyncValidators.validation)) {
      field.asyncValidators.validation.map(validate => {
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
    let validators = [];
    this.validationOpts.filter(opt => field.templateOptions[opt]).map((opt) => {
      validators.push(this.getValidation(opt, field.templateOptions[opt]));
    });
    if (field.validators) {
      for (let validatorName in field.validators) {
        if (validatorName !== 'validation') {
          validators.push((control: FormControl) => {
            let validator = field.validators[validatorName];
            if (isObject(validator)) {
              validator = validator.expression;
            }

            return validator(control) ? null : {[validatorName]: true};
          });
        }
      }
    }

    if (field.validators && Array.isArray(field.validators.validation)) {
      field.validators.validation.map(validate => {
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

  private addFormControl(form: FormGroup, field: FormlyFieldConfig, model) {
    if (field.component && field.component.createControl) {
      form.addControl(field.key, field.component.createControl(model, field));
    } else {
      form.addControl(field.key, new FormControl(
        { value: model, disabled: field.templateOptions.disabled },
        field.validators ? field.validators.validation : undefined,
        field.asyncValidators ? field.asyncValidators.validation : undefined,
      ));
    }
    if (field.validation && field.validation.show) {
      form.get(field.key).markAsTouched();
    }
  }

  private getValidation(opt, value) {
    switch (opt) {
      case this.validationOpts[0]:
        return Validators[opt];
      case this.validationOpts[1]:
      case this.validationOpts[2]:
      case this.validationOpts[3]:
        return Validators[opt](value);
      case this.validationOpts[4]:
      case this.validationOpts[5]:
        return (changes) => {
          if (this.checkMinMax(opt, changes.value, value)) {
            return null;
          } else {
            return {[opt]: true};
          }
        };
    }
  }

  private checkMinMax(opt, changes, value) {
    if (opt === this.validationOpts[4]) {
        return parseInt(changes) > value;
    } else {
        return parseInt(changes) < value;
    }
  }
}
