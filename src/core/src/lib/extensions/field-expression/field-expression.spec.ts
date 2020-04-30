import { TestBed, inject } from '@angular/core/testing';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { Subject, of, BehaviorSubject } from 'rxjs';
import { FormlyFieldConfig, FormlyFormBuilder, FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { MockComponent } from '../../test-utils';
import { FormlyValueChangeEvent, FormlyFormOptionsCache } from '../../components/formly.field.config';


describe('FieldExpressionExtension', () => {
  let form: FormGroup;
  let options: FormlyFormOptionsCache;
  let builder: FormlyFormBuilder;
  let TestComponent: Component;

  beforeEach(() => {
    TestComponent = MockComponent({ selector: 'formly-test-cmp' });
    TestBed.configureTestingModule({
      declarations: [TestComponent, RepeatComponent],
      imports: [
        FormlyModule.forRoot({
          types: [
            { name: 'input', component: TestComponent },
            { name: 'checkbox', component: TestComponent },
            { name: 'repeat', component: RepeatComponent },
          ],
          wrappers: [{ name: 'label', component: TestComponent, types: ['input'] }],
          validators: [{ name: 'required', validation: Validators.required }],
        }),
      ],
    });
  });

  beforeEach(inject([FormlyFormBuilder], (formlyBuilder: FormlyFormBuilder) => {
    form = new FormGroup({});
    options = {
      fieldChanges: new Subject<FormlyValueChangeEvent>(),
    };
    builder = formlyBuilder;
  }));

  describe('field visibility (hideExpression)', () => {
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

      builder.buildForm(form, fields, model, options);

      expect(fields[1].hide).toBeTruthy();
      expect(fields[1].templateOptions.hidden).toBeTruthy();

      model['visibilityToggle'] = 'test';

      options._checkField({ formControl: form, fieldGroup: fields, model, options });

      expect(fields[1].hide).toBeFalsy();
      expect(fields[1].templateOptions.hidden).toBeFalsy();
    });

    it('should not override hide field within fieldGroup', () => {
      const fields: FormlyFieldConfig[] = [
        {
          hideExpression: () => false,
          fieldGroup: [
            {
              key: 'test',
              type: 'input',
              hide: true,
            },
          ],
        },
      ];
      const spy = jasmine.createSpy('fieldChanges spy');
      const subscription = options.fieldChanges.subscribe(spy);

      builder.buildForm(form, fields, {}, options);

      expect(fields[0].hide).toBeFalsy();
      expect(fields[0].fieldGroup[0].hide).toBeTruthy();

      expect(spy).toHaveBeenCalledTimes(3);
      subscription.unsubscribe();
    });

    it('should toggle field control when hide changed programmatically', () => {
      const fields: FormlyFieldConfig[] = [
        { hide: false, key: 'foo'},
        { hide: true, fieldGroup: [{key: 'bar'}]},
      ];
      builder.buildForm(form, fields, {}, options);

      expect(form.get('foo')).not.toBeNull();
      expect(form.get('bar')).toBeNull();

      fields[0].hide = true;
      fields[1].hide = false;
      options._checkField({ formControl: form, fieldGroup: fields, options });

      expect(form.get('foo')).toBeNull();
      expect(form.get('bar')).not.toBeNull();
    });

    it('should update field visibility within field arrays', () => {
      const fields: FormlyFieldConfig[] = [
        {
          key: 'address',
          type: 'repeat',
          hideExpression: model => model.length !== 1,
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

      builder.buildForm(form, fields, model, options);

      const cityField = fields[0].fieldGroup[0].fieldGroup[0];

      expect(cityField.templateOptions.hidden).toBeTruthy();
      expect(cityField.hide).toBeTruthy();

      model.address[0].addressIsRequired = false;

      options._checkField({ formControl: form, fieldGroup: fields, model, options });

      expect(cityField.templateOptions.hidden).toBeFalsy();
      expect(cityField.hide).toBeFalsy();
    });

    it('should support multiple field with the same key', () => {
      const fields: FormlyFieldConfig[] = [
        {
          key: 'key1',
          type: 'input',
          formControl: new FormControl(),
          hideExpression: model => model.type,
        },
        {
          key: 'key1',
          type: 'input',
          formControl: new FormControl(),
          hideExpression: model => !model.type,
        },
      ];
      const model = { type: false };
      builder.buildForm(form, fields, model, options);

      options._checkField({ formControl: form, fieldGroup: fields, model, options });
      expect(fields[0].hide).toBeFalsy();
      expect(fields[0].formControl).toEqual(form.get('key1'));
      expect(fields[1].hide).toBeTruthy();
      expect(fields[1].formControl).not.toEqual(form.get('key1'));

      model.type = true;
      options._checkField({ formControl: form, fieldGroup: fields, model, options });
      expect(fields[0].hide).toBeTruthy();
      expect(fields[0].formControl).not.toEqual(form.get('key1'));
      expect(fields[1].hide).toBeFalsy();
      expect(fields[1].formControl).toEqual(form.get('key1'));
    });

    it('toggle controls of the hidden fields before the visible ones', () => {
      const fields: FormlyFieldConfig[] = [
        {
          key: 'key1',
          type: 'input',
          hideExpression: model => model.type,
        },
        {
          key: 'key1',
          type: 'input',
          hideExpression: model => !model.type,
        },
      ];
      const model = { type: false };
      builder.buildForm(form, fields, model, options);

      options._checkField({ formControl: form, fieldGroup: fields, model, options });
      expect(fields[0].hide).toBeFalsy();
      expect(fields[0].formControl).toBe(form.get('key1'));
      expect(fields[1].hide).toBeTruthy();
      expect(fields[1].formControl).toBe(form.get('key1'));
    });
  });

  describe('expressionProperties', () => {
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

        builder.buildForm(form, fields, model, options);

        expect(fields[1].formControl.status).toEqual('INVALID');

        model.checked = false;

        options._checkField({ formControl: form, fieldGroup: fields, model, options });

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

        builder.buildForm(form, fields, model, options);

        expect(fields[0].fieldGroup[1].formControl.status).toEqual('INVALID');

        model.fieldgroup.checked = false;

        options._checkField({ formControl: form, fieldGroup: fields, model, options });

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

        builder.buildForm(form, fields, model, options);

        const cityField = fields[0].fieldGroup[0].fieldGroup[0];

        expect(cityField.formControl.status).toEqual('INVALID');

        model.address[0].addressIsRequired = false;

        options._checkField({ formControl: form, fieldGroup: fields, model, options });

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

        builder.buildForm(form, fields, model, options);

        // manually disable the form control so that service can enable on `checkFields`
        fields[1].templateOptions.disabled = true;

        expect(fields[1].formControl.status).toEqual('DISABLED');

        options._checkField({ formControl: form, fieldGroup: fields, model, options });

        expect(fields[1].formControl.status).toEqual('VALID');
        expect(fields[1].templateOptions.disabled).toBeFalsy();

        model['disableToggle'] = true;

        options._checkField({ formControl: form, fieldGroup: fields, model, options });

        expect(fields[1].formControl.status).toEqual('DISABLED');
        expect(fields[1].templateOptions.disabled).toBeTruthy();
      });

      it('should take account of parent disabled state', () => {
        const disabled = {
          address: true,
          city: false,
        };
        const fields: FormlyFieldConfig[] = [{
          key: 'address',
          expressionProperties: { 'templateOptions.disabled': () => disabled.address },
          fieldGroup: [
            {
              key: 'city',
              type: 'input',
              expressionProperties: { 'templateOptions.disabled': () => disabled.city },
            },
            {
              key: 'street',
              type: 'input',
              expressionProperties: { 'templateOptions.label': () => 'Street' },
            },
          ],
        }];

        const model = {};

        builder.buildForm(form, fields, model, options);

        expect(fields[0].templateOptions.disabled).toBeTruthy();
        expect(fields[0].fieldGroup[0].templateOptions.disabled).toBeTruthy();
        expect(fields[0].fieldGroup[1].templateOptions.disabled).toBeTruthy();
        expect(fields[0].fieldGroup[1].templateOptions.label).toEqual('Street');

        disabled.address = false;
        options._checkField({ formControl: form, fieldGroup: fields, model, options });

        expect(fields[0].templateOptions.disabled).toBeFalsy();
        expect(fields[0].fieldGroup[0].templateOptions.disabled).toBeFalsy();
        expect(fields[0].fieldGroup[1].templateOptions.disabled).toBeFalsy();

        disabled.city = true;
        options._checkField({ formControl: form, fieldGroup: fields, model, options });

        expect(fields[0].templateOptions.disabled).toBeFalsy();
        expect(fields[0].fieldGroup[0].templateOptions.disabled).toBeTruthy();
        expect(fields[0].fieldGroup[1].templateOptions.disabled).toBeFalsy();
      });

      it('should update disabled state of hidden fields', () => {
        const fields: FormlyFieldConfig[] = [
          {
            key: 'group',
            expressionProperties: {
              'templateOptions.disabled': 'model.disableToggle',
            },
            fieldGroup: [
              { key: 'child', hide: true },
            ],
          },
        ];

        const model = {};
        builder.buildForm(form, fields, model, options);

        expect(fields[0].templateOptions.disabled).toEqual(false);
        expect(fields[0].fieldGroup[0].templateOptions.disabled).toEqual(false);

        model['group']['disableToggle'] = true;
        options._checkField({ formControl: form, fieldGroup: fields, model, options });

        expect(fields[0].templateOptions.disabled).toEqual(true);
        expect(fields[0].fieldGroup[0].templateOptions.disabled).toEqual(true);
      });
    });

    describe('expression as observable', () => {
      it('should update field from emitted observable values', () => {
        const fields: FormlyFieldConfig[] = [
          {
            key: 'text',
            type: 'input',
            expressionProperties: {
              'templateOptions.label': of('test'),
            },
          },
        ];
        const model = {};
        const options = {};

        builder.buildForm(form, fields, model, options);
        expect(fields[0].templateOptions.label).toEqual('test');
      });

      it('should update field on re-render', () => {
        const stream$ = new BehaviorSubject('test');
        const fields: FormlyFieldConfig[] = [
          {
            key: 'text',
            type: 'input',
            expressionProperties: {
              'templateOptions.label': stream$,
            },
          },
        ];
        const model = {};
        const options = {};

        builder.buildForm(form, fields, model, options);
        expect(fields[0].templateOptions.label).toEqual('test');

        fields[0].hooks.onDestroy();
        stream$.next('test2');
        expect(fields[0].templateOptions.label).toEqual('test');

        fields[0].hooks.onInit();
        expect(fields[0].templateOptions.label).toEqual('test2');
      });

      it('should change model through observable', () => {
        const fields: FormlyFieldConfig[] = [
          {
            key: 'text',
            type: 'input',
            expressionProperties: {
              'model.text': of('test'),
            },
          },
        ];
        const model = {};
        const options = {};

        builder.buildForm(form, fields, model, options);
        expect(fields[0].formControl.value).toEqual('test');
      });
    });

    it('should throw error when assign to an undefined prop', () => {
      const fields: FormlyFieldConfig[] = [
        {
          key: 'visibilityToggle',
          type: 'input',
          expressionProperties: {
            'nested.prop': '"ddd"',
          },
        },
      ];
      const model = {};

      const buildForm = () => builder.buildForm(form, fields, model, options);
      expect(buildForm).toThrowError(/\[Formly Error\] \[Expression "nested.prop"\] Cannot set property 'prop' of undefined/i);
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

      options.fieldChanges.subscribe(({ field, type, value }) => {
        if (type === 'hidden' && field.formControl && value) {
          field.formControl.setValue(null);
        }
      });

      builder.buildForm(form, fields, model, options);

      expect(fields[1].hide).toBeFalsy();
      expect(fields[1].templateOptions.hidden).toBeFalsy();
      expect(fields[1].formControl.value).toEqual('initial value');

      model['visibilityToggle'] = null;

      options._checkField({ formControl: form, fieldGroup: fields, model, options });

      expect(fields[1].hide).toBeTruthy();
      expect(fields[1].templateOptions.hidden).toBeTruthy();
      expect(fields[1].formControl.value).toBeNull();
    });
  });
});

@Component({
  selector: 'formly-repeat-section',
  template: '',
})
class RepeatComponent extends FieldArrayType { }
