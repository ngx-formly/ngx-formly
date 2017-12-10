import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';
import { FormlyConfig } from './formly.config';
import { FORMLY_VALIDATORS, evalStringExpression, evalExpressionValueSetter, evalExpression, getFieldId, assignModelValue, getValueForKey, isObject } from './../utils';
import { FormlyFieldConfig, FormlyFormOptions, FormlyValueChangeEvent } from '../components/formly.field.config';
import { getKeyPath, isUndefined, isFunction } from '../utils';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FormlyFormBuilder {
  private formId = 0;

  constructor(private formlyConfig: FormlyConfig) {}

  buildForm(form: FormGroup, fields: FormlyFieldConfig[] = [], model: any, options: FormlyFormOptions) {
    this.formId++;

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

  private registerFormControls(form: FormGroup, fields: FormlyFieldConfig[], model: any, options: FormlyFormOptions) {
    fields.map((field, index) => {
      field.id = getFieldId(`formly_${this.formId}`, field, index);

      if (!isUndefined(field.defaultValue) && isUndefined(getValueForKey(model, field.key))) {
        assignModelValue(model, field.key, field.defaultValue);
      }
      this.initFieldTemplateOptions(field);
      this.initFieldExpression(field, model, options);
      this.initFieldValidation(field);
      this.initFieldAsyncValidation(field);

      if (field.key && field.type) {
        this.formlyConfig.getMergedField(field);
        let paths: any = field.key;
        if (typeof paths === 'string') {
          paths = getKeyPath({key: field.key});
        }

        let rootForm = form;
        paths.forEach((path, index) => {
          // is last item
          if (index === paths.length - 1) {
            this.addFormControl(rootForm, field, model[paths[0]]);
          } else {
            let nestedForm = <FormGroup>(rootForm.get(path) ? rootForm.get(path) : new FormGroup({}));
            if (!rootForm.get(path)) {
              rootForm.addControl(path, nestedForm);
            }
            if (!model[path]) {
              model[path] = isNaN(paths[0]) ? {} : [];
            }

            rootForm = nestedForm;
          }
        });
      }

      if (field.fieldGroup) {
        if (field.key) {
          if (!model.hasOwnProperty(field.key)) {
            model[field.key] = {};
          }
          let nestedForm = <FormGroup>form.get(field.key),
            nestedModel = model[field.key] || {};

          if (!nestedForm) {
            nestedForm = new FormGroup(
              {},
              field.validators ? field.validators.validation : undefined,
              field.asyncValidators ? field.asyncValidators.validation : undefined,
            );
            this.addControl(form, field.key, nestedForm, field);
          }

          this.buildForm(nestedForm, field.fieldGroup, nestedModel, options);
        } else {
          this.buildForm(form, field.fieldGroup, model, options);
        }
      }

      if (field.fieldArray && field.key) {
        if (!(form.get(field.key) instanceof FormArray)) {
          const arrayForm = new FormArray(
            [],
            field.validators ? field.validators.validation : undefined,
            field.asyncValidators ? field.asyncValidators.validation : undefined,
          );
          this.addControl(form, field.key, arrayForm, field);
        }
      }
    });
  }

  private initFieldExpression(field: FormlyFieldConfig, model, options: FormlyFormOptions) {
    if (field.expressionProperties) {
      for (let key in field.expressionProperties as any) {
        if (typeof field.expressionProperties[key] === 'string' || isFunction(field.expressionProperties[key])) {
          // cache built expression
          field.expressionProperties[key] = {
            expression: isFunction(field.expressionProperties[key]) ? field.expressionProperties[key] : evalStringExpression(field.expressionProperties[key], ['model', 'formState']),
            expressionValueSetter: evalExpressionValueSetter(key, ['expressionValue', 'model', 'templateOptions', 'validation']),
          };
        }

        const expressionValue = evalExpression(field.expressionProperties[key].expression, { field }, [model, options.formState]);
        field.expressionProperties[key].expressionValue = expressionValue;
        evalExpression(field.expressionProperties[key].expressionValueSetter, { field }, [expressionValue, model, field.templateOptions || {}, field.validation]);
      }
    }

    if (field.hideExpression) {
      if (typeof field.hideExpression === 'string') {
        // cache built expression
        field.hideExpression = evalStringExpression(field.hideExpression, ['model', 'formState']);
      }

      field.hide = evalExpression(field.hideExpression, { field }, [model, options.formState]);
    }
  }

  private initFieldTemplateOptions(field: FormlyFieldConfig) {
    field.templateOptions = field.templateOptions || {};
    if (field.key && field.type) {
      field.templateOptions = Object.assign({
        label: '',
        placeholder: '',
        focus: false,
      }, field.templateOptions);
    }
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
    FORMLY_VALIDATORS
      .filter(opt => (field.templateOptions && field.templateOptions[opt])
        || (field.expressionProperties && field.expressionProperties[`templateOptions.${opt}`]),
      )
      .map((opt) => {
        validators.push((control: FormControl) => {
          if (!field.templateOptions[opt]) {
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

  private addFormControl(form: FormGroup, field: FormlyFieldConfig, model: any) {
    /* Although the type of the key property in FormlyFieldConfig is declared to be a string,
     the recurstion of this FormBuilder uses an Array.
     This should probably be addressed somehow. */
    let name: string = typeof field.key === 'string' ? field.key : field.key[0],
      formControl: AbstractControl;

    if (field.formControl instanceof AbstractControl) {
      formControl = field.formControl;
    } else if (field.component && field.component.createControl) {
      formControl = field.component.createControl(model, field);
    } else {
      formControl = new FormControl(
        model,
        field.validators ? field.validators.validation : undefined,
        field.asyncValidators ? field.asyncValidators.validation : undefined,
      );
    }

    if (field.templateOptions.disabled) {
      formControl.disable();
    }

    this.addControl(form, name, formControl, field);
  }

  private getValidation(opt, value) {
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

  private addControl(form: FormGroup, key: string, formControl: AbstractControl, field: FormlyFieldConfig) {
    field.formControl = formControl;
    if (field.hide) {
      return;
    }
    if (formControl instanceof FormArray) {
      form.setControl(key, formControl);
    } else {
      form.addControl(key, formControl);
    }
  }
}
