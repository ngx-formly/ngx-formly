import { FormControl, Validators, ValidationErrors, FormGroup, AbstractControl } from '@angular/forms';
import { of } from 'rxjs';
import { FormlyFieldConfigCache } from '../../models';
import { createBuilder } from '@ngx-formly/core/testing';

function buildField(field: FormlyFieldConfigCache): FormlyFieldConfigCache {
  const builder = createBuilder({
    extensions: ['core', 'validation'],
    onInit: (c) =>
      c.addConfig({
        validators: [
          { name: 'required', validation: Validators.required },
          { name: 'asyncRequired', validation: (ctrl) => of(Validators.required(ctrl)) },
          {
            name: 'val_with_options',
            options: { foo: 'test' },
            validation: (c, f, options) => ({ val_with_options: options }),
          },
        ],
      }),
  });

  field = { formControl: new FormControl(), ...field };
  builder.build(field);

  return field;
}

function validate(field: FormlyFieldConfigCache, value: any, errors: ValidationErrors) {
  const formControl = new FormControl(value, { validators: field._validators });
  expect(formControl.errors).toEqual(errors);
}

function asyncValidate(field: FormlyFieldConfigCache, value: any, errors: ValidationErrors) {
  const formControl = new FormControl(value, { asyncValidators: field._asyncValidators });
  formControl.statusChanges.subscribe(() => {
    expect(formControl.errors).toEqual(errors);
  });
}

describe('FieldValidationExtension: initialise field validators', () => {
  describe('built-in validations', () => {
    it('required', () => {
      const field = buildField({
        props: { required: true },
      });

      validate(field, 'test', null);
      validate(field, null, { required: true });
    });

    it('pattern', () => {
      const field = buildField({
        props: { pattern: '[0-9]{5}' },
      });

      validate(field, '75964', null);
      validate(field, 'ddd', { pattern: { requiredPattern: '^[0-9]{5}$', actualValue: 'ddd' } });
    });

    it('minLength', () => {
      const field = buildField({
        props: { minLength: 5 },
      });

      validate(field, '12345', null);
      validate(field, '123', { minLength: { requiredLength: 5, actualLength: 3 } });
    });

    it('maxLength', () => {
      const field = buildField({
        props: { maxLength: 10 },
      });

      validate(field, '123', null);
      validate(field, '12345678910', { maxLength: { requiredLength: 10, actualLength: 11 } });
    });

    it('min', () => {
      const field = buildField({
        props: { min: 10 },
      });

      validate(field, null, null);
      validate(field, 10, null);
      validate(field, 5, { min: { min: 10, actual: 5 } });
    });

    it('max', () => {
      const field = buildField({
        props: { max: 4 },
      });

      validate(field, null, null);
      validate(field, 3, null);
      validate(field, 5, { max: { max: 4, actual: 5 } });
    });

    it(`should take account of programmatic changes`, () => {
      const field = buildField({});
      field.formControl = new FormControl(null, field._validators);
      expect(field.formControl.valid).toBeTrue();

      field.props.required = true;
      expect(field.formControl.valid).toBeFalse();
    });

    it(`should ignore fieldGroup with empty key`, () => {
      const field = buildField({
        props: { max: 4 },
        fieldGroup: [],
      });
      expect(field._validators).toHaveLength(0);
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
          validators: { custom: (form) => form.value },
        });

        validate(field, 'test', null);
        validate(field, null, { custom: true });
      });

      it(`using expression property`, () => {
        const field = buildField({
          validators: {
            custom: { expression: (control: AbstractControl) => control.value === 'test' },
          },
        });

        validate(field, 'test', null);
        validate(field, null, { custom: true });
      });

      it(`using expression property with errorPath`, () => {
        const field = buildField({
          key: 'address',
          fieldGroup: [{ key: 'city' }],
          validators: {
            custom: {
              errorPath: 'pwd',
              expression: () => false,
              message: 'custom msg',
            },
          },
        });

        field.formControl = new FormGroup({ pwd: new FormControl() }, { validators: field._validators });

        field.formControl.setValue({ pwd: 'oo' });
        expect(field.formControl.errors).toEqual({
          custom: {
            errorPath: 'pwd',
            message: 'custom msg',
          },
        });
        expect(field.formControl.get('pwd').errors).toEqual({
          custom: {
            message: 'custom msg',
          },
        });
      });

      it(`using expression property with validation option`, () => {
        const field = buildField({
          validators: {
            validation: ['required'],
            required: { expression: (control: AbstractControl) => control.value === 'test' },
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
          custom: (control: FormControl) => new Promise((resolve) => resolve(control.value !== 'test')),
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

  it(`pass parameters to pre-defined type`, () => {
    const field = buildField({
      validators: {
        validation: [{ name: 'val_with_options', options: { foo: 'true' } }],
      },
    });

    const control = new FormControl(null, { validators: field._validators });
    expect(control.errors).toEqual({ val_with_options: { foo: 'true' } });
  });

  it(`pass parameters to FormlyConfig validator`, () => {
    const field = buildField({
      validators: {
        validation: [{ name: 'val_with_options' }],
      },
    });

    const control = new FormControl(null, { validators: field._validators });
    expect(control.errors).toEqual({ val_with_options: { foo: 'test' } });
  });
});
