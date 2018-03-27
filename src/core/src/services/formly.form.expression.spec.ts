import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { MockComponent } from '../test-utils';

import { FormlyConfig } from './formly.config';
import { FormlyFieldConfig, FormlyFormBuilder, FormlyFormOptions, FormlyForm } from '../core';
import { evalStringExpression, evalExpressionValueSetter, FORMLY_VALIDATORS, getKeyPath, isFunction, isObject } from './../utils';

import { FormlyFormExpression } from './formly.form.expression';

describe('FormlyFormExpression service', () => {
  let expression: FormlyFormExpression;
  let form: FormGroup;
  let builder: FormlyFormBuilder;
  let TestComponent: Component;

  beforeEach(() => {
    TestComponent = MockComponent({ selector: 'formly-test-cmp' });
    expression = new FormlyFormExpression();
    form = new FormGroup({});
    builder = new FormlyFormBuilder(
      new FormlyConfig([{
        types: [{ name: 'input', component: TestComponent }, { name: 'checkbox', component: TestComponent }],
        wrappers: [{ name: 'label', component: TestComponent, types: ['input'] }],
        validators: [{ name: 'required', validation: Validators.required }],
      }]),
      new FormlyFormExpression(),
    );
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

    builder.buildForm(form, fields, model, options);

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

    builder.buildForm(form, fields, model, options);

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

    builder.buildForm(form, fields, model, options);

    expression.checkFields(form, fields, model, options);

    expect(fields[1].formControl.status).toEqual('INVALID');

    model.checked = false;

    expression.checkFields(form, fields, model, options);

    expect(fields[1].formControl.status).toEqual('VALID');
  });
});
