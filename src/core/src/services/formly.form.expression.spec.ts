import { FormlyConfig } from './formly.config';
import { FormlyFieldConfig, FormlyFormOptions } from '../core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { evalStringExpression, evalExpressionValueSetter, FORMLY_VALIDATORS, getKeyPath, isFunction, isObject } from './../utils';

import { FormlyFormExpression } from './formly.form.expression';

function registerFormControls(form: FormGroup | FormArray, fields: FormlyFieldConfig[], model: any, options: FormlyFormOptions) {
  fields.forEach((field, index) => {
    initFieldOptions(field);
    initFieldExpression(field, model, options);
    initFieldValidation(field);

    if (field.key && field.type) {
      const paths = getKeyPath({ key: field.key });
      let rootForm = form, rootModel = model;
      paths.forEach((path, index) => {
        // FormGroup/FormArray only allow string value for path
        const formPath = path.toString();
        // is last item
        if (index === paths.length - 1) {
          addFormControl(rootForm, field, rootModel, formPath);
        } else {
          let nestedForm = rootForm.get(formPath) as FormGroup;
          if (!nestedForm) {
            nestedForm = new FormGroup({});
            addControl(rootForm, formPath, nestedForm);
          }
          if (!rootModel[path]) {
            rootModel[path] = typeof path === 'string' ? {} : [];
          }

          rootForm = nestedForm;
          rootModel = rootModel[path];
        }
      });
    }
  });
}

function initFieldOptions(field: FormlyFieldConfig) {
  field.templateOptions = field.templateOptions || {};
  if (field.type) {
    if (field.key) {
      field.templateOptions = Object.assign({
        label: '',
        placeholder: '',
        focus: false,
      }, field.templateOptions);
    }
  }
}

function initFieldExpression(field: FormlyFieldConfig, model: any, options: FormlyFormOptions) {
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

function initFieldValidation(field: FormlyFieldConfig) {
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

        return getValidation(opt, field.templateOptions[opt])(control);
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

function getValidation(opt: string, value: any) {
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

function addFormControl(form: FormGroup | FormArray, field: FormlyFieldConfig, model: any, path: string) {
  const control = new FormControl(
    model[path],
    field.validators ? field.validators.validation : undefined,
  );

  addControl(form, path, control, field);
}

function addControl(form: FormGroup | FormArray, key: string | number, formControl: AbstractControl, field?: FormlyFieldConfig) {
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

// TODO
describe('FormlyFormExpression service', () => {
  let expression: FormlyFormExpression;
  let form: FormGroup;

  beforeEach(() => {
    expression = new FormlyFormExpression();
    form = new FormGroup({});
  });

  it('should update field visibility', () => {
    const fields: FormlyFieldConfig[] = [
      {
        key: 'visibilityToggle',
        type: 'input',
      },
      {
        key: 'text',
        type: 'input',
        hideExpression: '!model.visibilityToggle',
      },
    ];
    const model = {};
    const options = {};

    registerFormControls(form, fields, model, options);

    expression.checkFields(form, fields, model, options);

    expect(fields[1].hide).toBeTruthy();
    expect(fields[1].templateOptions.hidden).toBeTruthy();

    model['visibilityToggle'] = 'test';

    expression.checkFields(form, fields, model, options);

    expect(fields[1].hide).toBeFalsy();
    expect(fields[1].templateOptions.hidden).toBeFalsy();
  });

  it('should update field disabled state', () => {
    const fields: FormlyFieldConfig[] = [
      {
        key: 'disableToggle',
        type: 'checkbox',
      },
      {
        key: 'text',
        type: 'input',
        expressionProperties: {
          'templateOptions.disabled': 'model.disableToggle',
        },
      },
    ];
    const model = {};
    const options = {};

    registerFormControls(form, fields, model, options);

    // manually disable the form control so that service can enable on `checkFields`
    fields[1].formControl.disable();

    expect(fields[1].formControl.status).toEqual('DISABLED');

    expression.checkFields(form, fields, model, options);

    expect(fields[1].formControl.status).toEqual('VALID');
    expect(fields[1].templateOptions.disabled).toBeFalsy();

    model['disableToggle'] = true;

    expression.checkFields(form, fields, model, options);

    expect(fields[1].formControl.status).toEqual('DISABLED');
    expect(fields[1].templateOptions.disabled).toBeTruthy();
  });

  it('should update the fields validity', () => {
    const fields: FormlyFieldConfig[] = [
      {
        key: 'checked',
        type: 'checkbox',
      },
      {
        key: 'text',
        type: 'input',
        templateOptions: {
          label: 'Am I required or not?',
        },
        expressionProperties: {
          'templateOptions.required': 'model.checked',
        },
      },
    ];
    const model = {
      checked: true,
    };
    const options = {};

    registerFormControls(form, fields, model, options);

    expression.checkFields(form, fields, model, options);

    expect(fields[1].formControl.status).toEqual('INVALID');

    model.checked = false;

    expression.checkFields(form, fields, model, options);

    expect(fields[1].formControl.status).toEqual('VALID');
  });
});
