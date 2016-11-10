import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { FormlyConfig } from './formly.config';
import { FormlyUtils } from './formly.utils';
import { FormlyFieldConfig } from '../components/formly.field.config';

@Injectable()
export class FormlyFormBuilder {
  private defaultPath;
  private validationOpts = ['required', 'pattern', 'minLength', 'maxLength', 'min', 'max'];
  private formId = 0;
  private model;

  constructor(private formlyConfig: FormlyConfig, private formlyUtils: FormlyUtils) {}

  buildForm(form: FormGroup, fields: FormlyFieldConfig[], model) {
    this.model = model;
    this.formId++;
    this.registerFormControls(form, fields, model);
  }

  private registerFormControls(form: FormGroup, fields: FormlyFieldConfig[], model) {
    fields.map((field, index) => {
      field.id = this.formlyUtils.getFieldId(`formly_${this.formId}`, field, index);
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
          let nestedForm = <FormGroup>(form.get(rootPath) ? form.get(rootPath) : new FormGroup({}, field.validators ? field.validators.validation : undefined, field.asyncValidaors ? field.asyncValidaors.validation : undefined));
          if (!form.get(field.key)) {
            form.addControl(rootPath, nestedForm);
          }
          if (!model[rootPath]) {
            model[rootPath] = isNaN(rootPath) ? {} : [];
          }

          this.buildForm(
            nestedForm,
            [Object.assign({}, field, {key: path})],
            model[rootPath]
          );
        } else {

          this.formlyConfig.getMergedField(field);
          this.initFieldValidation(field);
          this.initFieldAsyncValidation(field);
          this.addFormControl(form, field, model[path[0]] || field.defaultValue || '');
          if (field.defaultValue && !model[path[0]]) {
            this.formlyUtils.assignModelValue(this.model, this.defaultPath, field.defaultValue);
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
              field.asyncValidaors ? field.asyncValidaors.validation : undefined,
            );
            form.addControl(field.key, nestedForm);
          }

          this.buildForm(nestedForm, field.fieldGroup, nestedModel);
        } else {
          this.buildForm(form, field.fieldGroup, model);
        }
      }

      if (field.fieldArray && field.key) {
        const arrayForm = new FormArray(
          [],
          field.validators ? field.validators.validation : undefined,
          field.asyncValidaors ? field.asyncValidaors.validation : undefined,
        );
        form.setControl(field.key, arrayForm);
      }
    });
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
    if (field.asyncValidaors) {
      let asyncValidatorFn = (fn, validator) => (control: FormControl) => {
        return new Promise((resolve) => {
          return fn(control).then(result => {
            resolve(result ? null : {[validator]: true});
          });
        });
      };

      for (let validator in field.asyncValidaors) {
        if (validator !== 'validation') {
          validators.push(asyncValidatorFn(field.asyncValidaors[validator], validator));
        }
      }
    }
    if (field.asyncValidaors && Array.isArray(field.asyncValidaors.validation)) {
      field.asyncValidaors.validation.map(validate => {
        if (typeof validate === 'string') {
          validators.push(this.formlyConfig.getValidator(validate).validation);
        } else {
          validators.push(validate);
        }
      });
    }

    if (validators.length) {
      if (field.asyncValidaors && !Array.isArray(field.asyncValidaors.validation)) {
        field.asyncValidaors.validation = Validators.composeAsync([field.asyncValidaors.validation, ...validators]);
      } else {
        field.asyncValidaors = {
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
      let validatorFn = (fn, validator) => (control: FormControl) =>
          fn(control) ? null : {[validator]: true};

      for (let validator in field.validators) {
        if (validator !== 'validation') {
          validators.push(validatorFn(field.validators[validator], validator));
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
    if (field.component.createControl) {
      form.addControl(field.key, field.component.createControl(model, field));
    } else {
      form.addControl(field.key, new FormControl(
        { value: model, disabled: field.templateOptions.disabled },
        field.validators ? field.validators.validation : undefined,
        field.asyncValidaors ? field.asyncValidaors.validation : undefined,
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
