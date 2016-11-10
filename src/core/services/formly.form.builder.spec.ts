import { FormlyFormBuilder, FormlyConfig, FormlyFieldConfig } from './../core';
import { FormlyUtils } from './formly.utils';
import { FormGroup, Validators } from '@angular/forms';
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
        validators: [{ name: 'required', validation: Validators.required }],
      }], new FormlyUtils()),
      new FormlyUtils()
    );
  });

  describe('initialise default TemplateOptions', () => {
    it('should not set the default value if the specified key or type is undefined', () => {
      field = { key: 'title' };
      builder.buildForm(form, [field], {});

      expect(field.templateOptions).toEqual(undefined);
    });

    it('should set the default value if the specified key and type is defined', () => {
      field = { key: 'title', type: 'input', templateOptions: { placeholder: 'Title' } };
      builder.buildForm(form, [field], {});

      expect(field.templateOptions).toEqual({ label: '', placeholder: 'Title', focus: false });
    });
  });

  describe('generate field id', () => {
    it('should not generate id if it is defined', () => {
      field = { key: 'title', id: 'title_id' };
      builder.buildForm(form, [field], {});

      expect(field.id).toEqual('title_id');
    });

    it('should generate id if it is not defined', () => {
    field = { key: 'title' };
      builder.buildForm(form, [field], {});

      expect(field.id).toEqual('formly_1__title_0');
    });

    it('should generate an unique id for each form', () => {
      let field1 = { key: 'title' },
       field2 = { key: 'title' };

      builder.buildForm(form, [field1], {});
      builder.buildForm(form, [field2], {});

      expect(field1['id']).not.toEqual(field2['id']);
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

    beforeEach(() => {
      field = { key: 'title', type: 'input' };
    });

    describe('validation.show', () => {
      it('should show error when option `show` is true', () => {
        field.validators = { validation: ['required'] };
        field.validation = { show: true };
        builder.buildForm(form, [field], {});

        expect(form.get('title').touched).toBeTruthy();
      });

      it('should not show error when option `show` is false', () => {
        field.validators = { validation: ['required'] };
        field.validation = { show: false };
        builder.buildForm(form, [field], {});

        expect(form.get('title').touched).toBeFalsy();
      });
    });

    describe('validators', () => {
      describe('with validation option', () => {
        it(`using pre-defined type`, () => {
          field.validators = { validation: ['required'] };
          builder.buildForm(form, [field], {});

          expectValidators(null, 'test');
        });

        it(`using custom type`, () => {
          field.validators = { validation: [Validators.required] };
          builder.buildForm(form, [field], {});

          expectValidators(null, 'test');
        });
      });

      it(`without validation option`, () => {
        field.validators = { required: (form) => form.value };
        builder.buildForm(form, [field], {});

        expectValidators(null, 'test', {required: true});
      });
    });

    describe('using templateOptions', () => {
      const options = [
        { name: 'required', value: true, valid: 'test', invalid: null },
        { name: 'pattern', value: '[0-9]{5}', valid: '75964', invalid: 'ddd' },
        { name: 'minLength', value: 5, valid: '12345', invalid: '123' },
        { name: 'maxLength', value: 10, valid: '123', invalid: '12345678910' },
        { name: 'min', value: 5, valid: 6, invalid: 3 },
        { name: 'max', value: 10, valid: 8, invalid: 11 },
      ];

      options.map(option => {
        it(`${option.name}`, () => {
          field.templateOptions = { [option.name]: option.value };
          builder.buildForm(form, [field], {});

          expectValidators(option.invalid, option.valid);
        });
      });
    });
  });
});

@Component({selector: 'formly-test-cmp', template: '', entryComponents: []})
class TestComponent {
}
