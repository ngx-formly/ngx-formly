import { FormlyExtension, FormlyConfig, ValidatorOption } from '../../services/formly.config';
import { FormlyFieldConfigCache } from '../../components/formly.field.config';
import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { FORMLY_VALIDATORS, defineHiddenProp, isPromise, wrapProperty, clone } from '../../utils';
import { updateValidity } from '../field-form/utils';

/** @experimental */
export class FieldValidationExtension implements FormlyExtension {
  constructor(private formlyConfig: FormlyConfig) {}

  onPopulate(field: FormlyFieldConfigCache) {
    if (!field.parent || !field.key) {
      return;
    }

    this.initFieldValidation(field, 'validators');
    this.initFieldValidation(field, 'asyncValidators');
  }

  private initFieldValidation(field: FormlyFieldConfigCache, type: 'validators' | 'asyncValidators') {
    const validators: ValidatorFn[] = type === 'validators' ? [this.getPredefinedFieldValidation(field)] : [];
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

    defineHiddenProp(
      field,
      '_' + type,
      type === 'validators' ? Validators.compose(validators) : Validators.composeAsync(validators as any),
    );
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
    return (control: AbstractControl) => {
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
        validatorOption = {
          name: validatorName,
          validation: validator.expression,
          options: {
            errorPath: validator.errorPath,
            message: validator.message,
          },
        };
      }

      if (typeof validator === 'function') {
        validatorOption = {
          name: validatorName,
          validation: validator,
          options: {},
        };
      }

      const isValid = validatorOption.validation(control, field, validatorOption.options);
      if (validatorName) {
        if (isPromise(isValid)) {
          return isValid.then((result: boolean) => {
            // workaround for https://github.com/angular/angular/issues/13200
            if (field.options && field.options._markForCheck) {
              field.options._markForCheck(field);
            }

            return this.handleResult(field, result, validatorOption);
          });
        }

        return this.handleResult(field, isValid, validatorOption);
      }

      return isValid;
    };
  }

  private handleResult(field: FormlyFieldConfigCache, isValid, { name, options }: ValidatorOption) {
    if (options && field.formControl && options.errorPath) {
      const control = field.formControl.get(options.errorPath);
      if (control) {
        const controlErrors = (control.errors || {});
        if (!isValid) {
          control.setErrors({ ...controlErrors, [name]: { message: options.message } });
        } else {
          delete controlErrors[name];
          control.setErrors(Object.keys(controlErrors).length === 0 ? null : controlErrors);
        }
      }

      return isValid ? null : { [name]: { errorPath: options.errorPath } };
    }

    return isValid ? null : { [name]: true };
  }
}
