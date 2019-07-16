import { TestBed, inject } from '@angular/core/testing';
import { FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Subject, of } from 'rxjs';
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

      expect(spy).toHaveBeenCalledTimes(2);
      subscription.unsubscribe();
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
            },
          ],
        }];

        const model = {};

        builder.buildForm(form, fields, model, options);

        expect(fields[0].templateOptions.disabled).toBeTruthy();
        expect(fields[0].fieldGroup[0].templateOptions.disabled).toBeTruthy();
        expect(fields[0].fieldGroup[1].templateOptions.disabled).toBeTruthy();

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
