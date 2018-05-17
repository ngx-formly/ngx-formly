import { FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';

import { Subject } from 'rxjs';

import { MockComponent } from '../test-utils';

import { FormlyValueChangeEvent } from '../components/formly.field.config';
import { FormlyConfig } from './formly.config';
import { FormlyFieldConfig, FormlyFormBuilder, FormlyFormOptions, FieldArrayType } from '../core';

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
        types: [
          { name: 'input', component: TestComponent },
          { name: 'checkbox', component: TestComponent },
          { name: 'repeat', component: FieldArrayType },
        ],
        wrappers: [{ name: 'label', component: TestComponent, types: ['input'] }],
        validators: [{ name: 'required', validation: Validators.required }],
      }]),
      new FormlyFormExpression(),
    );
  });

  describe('field visibility', () => {
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

    it('should update field visibility within field arrays', () => {
      const fields: FormlyFieldConfig[] = [
        {
          key: 'address',
          type: 'repeat',
          fieldArray: {
            fieldGroup: [
              {
                key: 'city',
                type: 'input',
                hideExpression: 'model.addressIsRequired',
              },
            ],
          },
        },
        {
          key: 'addressIsRequired',
          type: 'checkbox',
        },
      ];
      const model = {
        address: [{
          addressIsRequired: true,
        }],
      };
      const options = {};

      builder.buildForm(form, fields, model, options);

      expression.checkFields(form, fields, model, options);

      const cityField = fields[0].fieldGroup[0].fieldGroup[0];

      expect(cityField.templateOptions.hidden).toBeTruthy();
      expect(cityField.hide).toBeTruthy();

      model.address[0].addressIsRequired = false;

      expression.checkFields(form, fields, model, options);

      expect(cityField.templateOptions.hidden).toBeFalsy();
      expect(cityField.hide).toBeFalsy();
    });
  });

  describe('field validity', () => {
    it('should update field validity', () => {
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

    it('should update field validity within field groups', () => {
      const fields: FormlyFieldConfig[] = [
        {
          key: 'fieldgroup',
          fieldGroup: [
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
          ],
        },
      ];
      const model = {
        fieldgroup: {
          checked: true,
        },
      };
      const options = {};

      builder.buildForm(form, fields, model, options);

      expression.checkFields(form, fields, model, options);

      expect(fields[0].fieldGroup[1].formControl.status).toEqual('INVALID');

      model.fieldgroup.checked = false;

      expression.checkFields(form, fields, model, options);

      expect(fields[0].fieldGroup[1].formControl.status).toEqual('VALID');
    });

    it('should update field validity within field arrays', () => {
      const fields: FormlyFieldConfig[] = [
        {
          key: 'address',
          type: 'repeat',
          fieldArray: {
            fieldGroup: [
              {
                key: 'city',
                type: 'input',
                expressionProperties: {
                  'templateOptions.required': 'model.addressIsRequired',
                },
              },
            ],
          },
        },
        {
          key: 'addressIsRequired',
          type: 'checkbox',
        },
      ];
      const model = {
        address: [{
          addressIsRequired: true,
        }],
      };
      const options = {};

      builder.buildForm(form, fields, model, options);

      expression.checkFields(form, fields, model, options);

      const cityField = fields[0].fieldGroup[0].fieldGroup[0];

      expect(cityField.formControl.status).toEqual('INVALID');

      model.address[0].addressIsRequired = false;

      expression.checkFields(form, fields, model, options);

      expect(cityField.formControl.status).toEqual('VALID');
    });
  });

  describe('field disabled state', () => {
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
      fields[1].templateOptions.disabled = true;

      expect(fields[1].formControl.status).toEqual('DISABLED');

      expression.checkFields(form, fields, model, options);

      expect(fields[1].formControl.status).toEqual('VALID');
      expect(fields[1].templateOptions.disabled).toBeFalsy();

      model['disableToggle'] = true;

      expression.checkFields(form, fields, model, options);

      expect(fields[1].formControl.status).toEqual('DISABLED');
      expect(fields[1].templateOptions.disabled).toBeTruthy();
    });
  });

  describe('field changes', () => {
    it('should allow subscription of FormlyValueChangeEvent', () => {
      const fields: FormlyFieldConfig[] = [
        {
          key: 'visibilityToggle',
          type: 'input',
          defaultValue: 'show text',
        },
        {
          key: 'text',
          type: 'input',
          defaultValue: 'initial value',
          hideExpression: '!model.visibilityToggle',
        },
      ];
      const model = {};
      const options: FormlyFormOptions = {
        fieldChanges: new Subject<FormlyValueChangeEvent>(),
      };

      options.fieldChanges.subscribe(({field, type, value}) => {
        if (type === 'hidden' && field.formControl && value) {
          field.formControl.setValue(null);
        }
      });

      builder.buildForm(form, fields, model, options);

      expression.checkFields(form, fields, model, options);

      expect(fields[1].hide).toBeFalsy();
      expect(fields[1].templateOptions.hidden).toBeFalsy();
      expect(fields[1].formControl.value).toEqual('initial value');

      model['visibilityToggle'] = null;

      expression.checkFields(form, fields, model, options);

      expect(fields[1].hide).toBeTruthy();
      expect(fields[1].templateOptions.hidden).toBeTruthy();
      expect(fields[1].formControl.value).toBeNull();
    });
  });
});
