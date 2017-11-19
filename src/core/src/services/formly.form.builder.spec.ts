import { FormlyFormBuilder, FormlyConfig, FormlyFieldConfig } from '../core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component } from '@angular/core';

describe('FormlyFormBuilder service', () => {
  let builder: FormlyFormBuilder,
    form: FormGroup,
    field: FormlyFieldConfig;
  beforeEach(() => {
    form = new FormGroup({});
    builder = new FormlyFormBuilder(
      new FormlyConfig([{
        types: [{ name: 'input', component: TestComponent }],
        wrappers: [{ name: 'label', component: TestComponent, types: ['input'] }],
        validators: [{ name: 'required', validation: Validators.required }],
      }]),
    );
  });

  describe('initialise default TemplateOptions', () => {
    it('should not set the default value if the specified key or type is undefined', () => {
      field = { key: 'title' };
      builder.buildForm(form, [field], {}, {});

      expect(field.templateOptions).toEqual({});
    });

    it('should set the default value if the specified key and type is defined', () => {
      field = { key: 'title', type: 'input', templateOptions: { placeholder: 'Title' } };
      builder.buildForm(form, [field], {}, {});

      expect(field.templateOptions).toEqual(<any> { label: '', placeholder: 'Title', focus: false });
    });

    it('should set the default value if the specified key and type is defined for fieldGroup', () => {
      field = {
        key: 'fieldgroup',
        fieldGroup: [{ key: 'title', type: 'input', templateOptions: { placeholder: 'Title' } }],
      };
      builder.buildForm(form, [field], {}, {});
      expect(field.fieldGroup[0].templateOptions).toEqual(<any> { label: '', placeholder: 'Title', focus: false });
    });
  });

  describe('field defaultValue', () => {
    it('should not set the defaultValue if the model value is defined', () => {
      let model = { title: 'title' };
      field = {
        key: 'title',
        type: 'input',
        defaultValue: 'test',
      };
      builder.buildForm(form, [field], model, {});

      expect(model['title']).toEqual('title');
    });

    it('should set the defaultValue if the model value is not defined', () => {
      let model = {};
      field = {
        key: 'title',
        type: 'input',
        defaultValue: false,
      };
      builder.buildForm(form, [field], model, {});

      expect(model['title']).toBeFalsy();
    });

    it('should set the defaultValue for nested form', () => {
      let model = {};
      field = {
        key: 'address',
        fieldGroup: [
          {
            key: 'city',
            type: 'input',
            defaultValue: 'foo',
          },
        ],
      };
      builder.buildForm(form, [field], model, {});

      expect(model['address']).toEqual({ city: 'foo' });
    });
  });

  describe('field expression', () => {
    it('should built field expression', () => {
      field = {
        key: 'title',
        hideExpression: '!model',
        expressionProperties: {
          'templateOptions.disabled': '!model',
          'templateOptions.label': (model) => !model ? 'Title *' : 'Title',
        },
      };

      builder.buildForm(form, [field], {}, {});
      const disabledExpression = field.expressionProperties['templateOptions.disabled'];
      expect(typeof disabledExpression.expression).toBe('function');
      expect(typeof disabledExpression.expressionValueSetter).toBe('function');

      const labelExpression = field.expressionProperties['templateOptions.label'];
      expect(typeof labelExpression.expression).toBe('function');
      expect(typeof labelExpression.expressionValueSetter).toBe('function');

      expect(typeof field.hideExpression).toBe('function');
    });

    it('should execute field expression during form build', () => {
      field = {
        key: 'title',
        type: 'input',
        hideExpression: '!model',
        expressionProperties: {
          'templateOptions.disabled': 'undefined !== model',
          'templateOptions.label': (model) => !model ? 'Title *' : 'Title',
        },
        templateOptions: { disabled: false },
      };

      builder.buildForm(form, [field], {}, {});
      expect(field.templateOptions.disabled).toBeTruthy();
      expect(field.formControl.status).toEqual('DISABLED');

      expect(field.templateOptions.label).toEqual('Title');
    });
  });

  describe('generate field id', () => {
    it('should not generate id if it is defined', () => {
      field = { key: 'title', id: 'title_id' };
      builder.buildForm(form, [field], {}, {});

      expect(field.id).toEqual('title_id');
    });

    it('should generate id if it is not defined', () => {
    field = { key: 'title' };
      builder.buildForm(form, [field], {}, {});

      expect(field.id).toEqual('formly_1__title_0');
    });

    it('should generate an unique id for each form', () => {
      let field1 = { key: 'title' },
       field2 = { key: 'title' };

      builder.buildForm(form, [field1], {}, {});
      builder.buildForm(form, [field2], {}, {});

      expect(field1['id']).not.toEqual(field2['id']);
    });
  });

  describe('form control creation and addition', () => {
    it('should let component create the form control', () =>  {
      let field = { key: 'title', type: 'input', component: new TestComponentThatCreatesControl() };

      builder.buildForm(form, [field], {}, {});

      let control: FormControl = <FormControl> form.get('title');
      expect(control).not.toBeNull();
      expect(control.value).toEqual('created by component');
    });

    it('should add form control to form When `hide` is false', () => {
      field = {
        key: 'title',
        type: 'input',
        hideExpression: 'false',
        validation: {
          show: true,
        },
      };

      builder.buildForm(form, [field], {}, {});
      let control: FormControl = <FormControl> form.get('title');

      expect(field.hide).toBeFalsy();
      expect(field.formControl).not.toBeNull();
      expect(control).not.toBeNull();
    });

    it('should not add form control to form when `hide` is true', () => {
      field = {
        key: 'title',
        type: 'input',
        hideExpression: 'true',
        validation: {
          show: true,
        },
      };

      builder.buildForm(form, [field], {}, {});
      let control: FormControl = <FormControl> form.get('title');

      expect(field.hide).toBeTruthy();
      expect(field.formControl).not.toBeNull();
      expect(control).toBeNull();
    });
  });

  describe('merge field options', () => {
    it('nested property key', () => {
      field = { key: 'nested.title', type: 'input' };
      builder.buildForm(form, [field], {}, {});

      expect(field.key).toEqual('nested.title');
      expect(field.wrappers).toEqual(['label']);
    });

    it('should not override wrappers if not empty', () => {
      field = { key: 'nested.title', type: 'input', wrappers: [] };
      builder.buildForm(form, [field], {}, {});

      expect(field.key).toEqual('nested.title');
      expect(field.wrappers).toEqual([]);
    });
  });

  describe('initialise field validators', () => {
    const expectValidators = (invalidValue, validValue, errors?) => {
      const formControl = form.get('title');
      expect(typeof field.validators.validation).toBe('function');

      formControl.patchValue(invalidValue);
      expect(formControl.valid).toBeFalsy();
      if (errors) {
        expect(formControl.errors).toEqual(errors);
      }

      formControl.patchValue(validValue);
      expect(formControl.valid).toBeTruthy();
    };

    const expectAsyncValidators = (value) => {
      const formControl = form.get('title');
      expect(typeof field.asyncValidators.validation).toBe('function');

      formControl.patchValue(value);
      expect(formControl.status).toBe('PENDING');
    };

    beforeEach(() => {
      field = { key: 'title', type: 'input' };
    });

    describe('validation.show', () => {
      it('should show error when option `show` is true', () => {
        field.validators = { validation: ['required'] };
        field.validation = { show: true };
        const options: any = {};
        builder.buildForm(form, [field], {}, options);

        expect(options.showError({ field, options, formControl: form })).toBeTruthy();
      });

      it('should not show error when option `show` is false', () => {
        field.validators = { validation: ['required'] };
        field.validation = { show: false };
        const options: any = {};
        builder.buildForm(form, [field], {}, options);

        expect(options.showError({ field, options, formControl: form })).toBeFalsy();
      });
    });

    describe('validators', () => {
      describe('with validation option', () => {
        it(`using pre-defined type`, () => {
          field.validators = { validation: ['required'] };
          builder.buildForm(form, [field], {}, {});

          expectValidators(null, 'test');
        });

        it(`using custom type`, () => {
          field.validators = { validation: [Validators.required] };
          builder.buildForm(form, [field], {}, {});

          expectValidators(null, 'test');
        });
      });

      describe('without validation option', () => {
        it(`using function`, () => {
          field.validators = { required: (form) => form.value };
          builder.buildForm(form, [field], {}, {});

          expectValidators(null, 'test', {required: true});
        });

        it(`using expression property`, () => {
          field.validators = {
            required: { expression: (form) => form.value },
          };
          builder.buildForm(form, [field], {}, {});

          expectValidators(null, 'test', {required: true});
        });
      });
    });

    describe('asyncValidators', () => {
      it(`uses asyncValidator objects`, () => {
        field.asyncValidators = { custom: (control: FormControl) => new Promise(resolve => resolve( control.value !== 'test'))};
        builder.buildForm(form, [field], {}, {});

        expectAsyncValidators('test');
      });

      it(`uses asyncValidator objects`, () => {
        field.asyncValidators = { validation: [(control: FormControl) =>
        new Promise(resolve => resolve( control.value !== 'john' ? null : { uniqueUsername: true }))] };
        builder.buildForm(form, [field], {}, {});

        expectAsyncValidators('test');
      });
    });

    describe('using templateOptions', () => {
      const options = [
        { name: 'required', value: true, valid: 'test', invalid: null },
        { name: 'pattern', value: '[0-9]{5}', valid: '75964', invalid: 'ddd' },
        { name: 'minLength', value: 5, valid: '12345', invalid: '123' },
        { name: 'maxLength', value: 10, valid: '123', invalid: '12345678910' },
        { name: 'min', value: 5, valid: 6, invalid: 3 },
        { name: 'min', value: 10, valid: 10, invalid: 2 },
        { name: 'min', value: 10, valid: null, invalid: 2 },
        { name: 'min', value: 10, valid: '', invalid: 2 },
        { name: 'max', value: 10, valid: 8, invalid: 11 },
        { name: 'max', value: 4, valid: 4, invalid: 5 },
        { name: 'max', value: 4, valid: null, invalid: 5 },
        { name: 'max', value: 4, valid: '', invalid: 5 },
      ];

      options.map(option => {
        it(`${option.name}`, () => {
          field.templateOptions = { [option.name]: option.value };
          builder.buildForm(form, [field], {}, {});

          expectValidators(option.invalid, option.valid);
        });
      });
    });
  });
});

@Component({selector: 'formly-test-cmp', template: '', entryComponents: []})
class TestComponent {
}

class TestComponentThatCreatesControl {

  createControl(model, field) {
    return new FormControl('created by component');
  }

}
