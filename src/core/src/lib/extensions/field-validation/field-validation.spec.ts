import { FieldValidationExtension } from './field-validation';
import { FormlyFieldConfig, FormlyFieldConfigCache } from '../../components/formly.field.config';
import { FormlyConfig } from '../../services/formly.config';
import { FormControl, Validators, ValidationErrors } from '@angular/forms';
import { of } from 'rxjs';

function buildField(field: FormlyFieldConfig): FormlyFieldConfigCache {
  field = {
    key: 'name',
    modelOptions: {},
    templateOptions: {},
    parent: {},
    ...field,
  };

  const config = new FormlyConfig();
  config.addConfig({
    validators: [
      {name: 'required', validation: Validators.required },
      { name: 'asyncRequired', validation: c => of(Validators.required(c)) },
    ],
  });

  const extension = new FieldValidationExtension(config);
  extension.onPopulate(field);

  return field;
}

function validate(field: FormlyFieldConfigCache, value: any, errors: ValidationErrors) {
  const formControl = new FormControl(value, { validators: field._validators });
  expect(typeof field._validators === 'function').toBeTruthy();
  expect(formControl.errors).toEqual(errors);
}

function asyncValidate(field: FormlyFieldConfigCache, value: any, errors: ValidationErrors) {
  const formControl = new FormControl(value, { asyncValidators: field._asyncValidators });
  expect(typeof field._asyncValidators === 'function').toBeTruthy();
  formControl.statusChanges.subscribe(() => {
    expect(formControl.errors).toEqual(errors);
  });
}

describe('FieldValidationExtension: initialise field validators', () => {
  describe('built-in validations', () => {
    it('required', () => {
      const field = buildField({
        templateOptions: { required: true },
      });

      validate(field, 'test', null);
      validate(field, null, { required: true });
    });

    it('pattern', () => {
      const field = buildField({
        templateOptions: { pattern: '[0-9]{5}' },
      });

      validate(field, '75964', null);
      validate(field, 'ddd', { pattern: { requiredPattern: '^[0-9]{5}$', actualValue: 'ddd' } });
    });

    it('minLength', () => {
      const field = buildField({
        templateOptions: { minLength: 5 },
      });

      validate(field, '12345', null);
      validate(field, '123', { minlength: { requiredLength: 5, actualLength: 3 } });
    });

    it('maxLength', () => {
      const field = buildField({
        templateOptions: { maxLength: 10 },
      });

      validate(field, '123', null);
      validate(field, '12345678910', { maxlength: { requiredLength: 10, actualLength: 11 } });
    });

    it('min', () => {
      const field = buildField({
        templateOptions: { min: 10 },
      });

      validate(field, null, null);
      validate(field, 10, null);
      validate(field, 5, { min: { min: 10, actual: 5 } });
    });

    it('max', () => {
      const field = buildField({
        templateOptions: { max: 4 },
      });

      validate(field, null, null);
      validate(field, 3, null);
      validate(field, 5, { max: { max: 4, actual: 5 } });
    });
  });

  describe('validators', () => {
    describe('using `validation` option', () => {
      it(`using pre-defined type`, () => {
        const field = buildField({
          validators: { validation: ['required'] },
        });

        validate(field, 'test', null);
        validate(field, null, { required: true });
      });

      it(`using custom type`, () => {
        const field = buildField({
          validators: { validation: [Validators.required] },
        });

        validate(field, 'test', null);
        validate(field, null, { required: true });
      });
    });

    describe('without validation option', () => {
      it(`using function`, () => {
        const field = buildField({
          validators: { required: (form) => form.value },
        });

        validate(field, 'test', null);
        validate(field, null, { required: true });
      });

      it(`using expression property`, () => {
        const field = buildField({
          validators: {
            required: { expression: (form, field) => field.key === 'name' ? form.value : false },
          },
        });

        validate(field, 'test', null);
        validate(field, null, { required: true });
      });

      it(`using expression property with validation option`, () => {
        const field = buildField({
          validators: {
            validation: ['required'],
            required: { expression: (form, field) => field.key === 'name' ? form.value : false },
          },
        });

        validate(field, 'test', null);
        validate(field, null, { required: true });
      });
    });
  });

  describe('asyncValidators', () => {
    it(`using Promise`, () => {
      const field = buildField({
        asyncValidators: {
          custom: (control: FormControl) => new Promise(resolve => resolve(control.value !== 'test')),
        },
      });

      asyncValidate(field, 'test', null);
      asyncValidate(field, 'custom', { custom: true });
    });

    it(`using Observable`, () => {
      const field = buildField({
        asyncValidators: {
          custom: (control: FormControl) => of(control.value !== 'test'),
        },
      });

      asyncValidate(field, 'test', null);
      asyncValidate(field, 'custom', { custom: true });
    });
  });
});
