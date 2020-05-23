import { FormlyExtension, FormlyConfig, ValidatorOption } from '../../services/formly.config';
import { FormlyFieldConfigCache } from '../../components/formly.field.config';
import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { FORMLY_VALIDATORS, defineHiddenProp, isPromise, wrapProperty, clone } from '../../utils';
import { updateValidity } from '../field-form/utils';

/** @experimental */
export class FieldValidationExtension implements FormlyExtension {
  constructor(private formlyConfig: FormlyConfig) {}

  onPopulate(field: FormlyFieldConfigCache) {
    this.initFieldValidation(field, 'validators');
    this.initFieldValidation(field, 'asyncValidators');
  }

  private initFieldValidation(field: FormlyFieldConfigCache, type: 'validators' | 'asyncValidators') {
    const validators: ValidatorFn[] = [];
    if (type === 'validators' && !(field.hasOwnProperty('fieldGroup') && !field.key)) {
      validators.push(this.getPredefinedFieldValidation(field));
    }

    if (field[type]) {
      for (const validatorName in field[type]) {
        if (validatorName === 'validation' && !Array.isArray(field[type].validation)) {
          field[type].validation = [field[type].validation];
          console.warn(`NgxFormly(${field.key}): passing a non array value to the 'validation' is deprecated, pass an array instead`);
        }

        validatorName === 'validation'
          ? validators.push(...field[type].validation.map(v => this.wrapNgValidatorFn(field, v)))
          : validators.push(this.wrapNgValidatorFn(field, field[type][validatorName], validatorName))
        ;
      }
    }

    defineHiddenProp(field, '_' + type, validators);
  }

  private getPredefinedFieldValidation(field: FormlyFieldConfigCache): ValidatorFn {
    let VALIDATORS = [];
    FORMLY_VALIDATORS.forEach(opt => wrapProperty(field.templateOptions, opt, ({ currentValue, firstChange }) => {
      VALIDATORS = VALIDATORS.filter(o => o !== opt);
      if (currentValue != null && currentValue !== false) {
        VALIDATORS.push(opt);
      }
      if (!firstChange && field.formControl) {
        updateValidity(field.formControl);
      }
    }));

    return (control: AbstractControl) => {
      if (VALIDATORS.length === 0) {
        return null;
      }

      return Validators.compose(VALIDATORS.map(opt => () => {
        const value = field.templateOptions[opt];
        switch (opt) {
          case 'required':
            return Validators.required(control);
          case 'pattern':
            return Validators.pattern(value)(control);
          case 'minLength':
            return Validators.minLength(value)(control);
          case 'maxLength':
            return Validators.maxLength(value)(control);
          case 'min':
            return Validators.min(value)(control);
          case 'max':
            return Validators.max(value)(control);
        }
      }))(control);
    };
  }

  private wrapNgValidatorFn(field: FormlyFieldConfigCache, validator: any, validatorName?: string) {
    let validatorOption: ValidatorOption = null;
    if (typeof validator === 'string') {
      validatorOption = clone(this.formlyConfig.getValidator(validator));
    }

    if (typeof validator === 'object' && validator.name) {
      validatorOption = clone(this.formlyConfig.getValidator(validator.name));
      if (validator.options) {
        validatorOption.options = validator.options;
      }
    }

    if (typeof validator === 'object' && validator.expression) {
      const { expression, ...options } = validator;
      validatorOption = {
        name: validatorName,
        validation: expression,
        options: Object.keys(options).length > 0 ? options : null,
      };
    }

    if (typeof validator === 'function') {
      validatorOption = {
        name: validatorName,
        validation: validator,
      };
    }

    return (control: AbstractControl) => {
      let errors: any = validatorOption.validation(control, field, validatorOption.options);
      if (validatorName) {
        if (isPromise(errors)) {
          return errors.then((result: boolean) => {
            // workaround for https://github.com/angular/angular/issues/13200
            if (field.options && field.options._markForCheck) {
              field.options._markForCheck(field);
            }

            return this.handleResult(field, !!result, validatorOption);
          });
        }
        errors = !!errors;
      }

      return this.handleResult(field, errors, validatorOption);
    };
  }

  private handleResult(field: FormlyFieldConfigCache, errors: any, { name, options }: ValidatorOption) {
    if (typeof errors === 'boolean') {
      errors = errors ? null : { [name]: options ? options : true };
    }

    if (options && field.formControl && options.errorPath) {
      const control = field.formControl.get(options.errorPath);
      if (control) {
        const controlErrors = (control.errors || {});
        if (errors && errors[name] && !controlErrors[name]) {
          const { errorPath, ...opts } = errors[name];
          control.setErrors({ ...controlErrors, [name]: opts });
        } else if (errors === null && controlErrors[name]) {
          delete controlErrors[name];
          control.setErrors(Object.keys(controlErrors).length === 0 ? null : controlErrors);
        }
      }
    }

    return errors;
  }
}
