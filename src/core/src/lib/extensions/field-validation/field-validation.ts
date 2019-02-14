import { FormlyExtension, FieldValidatorFn, FormlyConfig } from '../../services/formly.config';
import { FormlyFieldConfigCache } from '../../components/formly.field.config';
import { AbstractControl, Validators } from '@angular/forms';
import { isObject, FORMLY_VALIDATORS, defineHiddenProp } from '../../utils';

/** @experimental */
export class FieldValidationExtension implements FormlyExtension {
  constructor(private formlyConfig: FormlyConfig) {}

  onPopulate(field: FormlyFieldConfigCache) {
    this.initFieldValidation(field);
    this.initFieldAsyncValidation(field);
  }

  private initFieldValidation(field: FormlyFieldConfigCache) {
    if (field._validators) {
      return;
    }

    defineHiddenProp(field, '_validators', []);
    this.initPredefinedFieldValidation(field);
    if (field.validators) {
      for (const validatorName in field.validators) {
        if (validatorName !== 'validation') {
          let validator = field.validators[validatorName];
          let errorPath;
          let message;
          if (isObject(validator)) {
            errorPath = validator.errorPath;
            message = validator.message;
            validator = validator.expression;
          }

          field._validators.push((control: AbstractControl) => {
            const isValid = validator(control, field);
            if (errorPath && field.formControl && field.formControl.get(errorPath)) {
              if (!isValid) {
                field.formControl.get(errorPath).setErrors({
                  ...(field.formControl.get(errorPath).errors || {}),
                  [validatorName]: { message },
                });
              } else {
                const errors = (field.formControl.get(errorPath).errors || {});
                delete errors[validatorName];
                field.formControl.get(errorPath).setErrors(Object.keys(errors).length === 0 ? null : errors);
              }
            }

            return isValid ? null : { [validatorName]: errorPath ? { errorPath } : true };
          });
        } else {
          if (!Array.isArray(field.validators.validation)) {
            field.validators.validation = [field.validators.validation];
          }
          field.validators.validation
            .forEach((validator: any) => field._validators.push(this.wrapNgValidatorFn(field, validator)));
        }
      }
    }
  }

  private initFieldAsyncValidation(field: FormlyFieldConfigCache) {
    if (field._asyncValidators) {
      return;
    }

    defineHiddenProp(field, '_asyncValidators', []);
    if (field.asyncValidators) {
      for (const validatorName in field.asyncValidators) {
        if (validatorName !== 'validation') {
          let validator = field.asyncValidators[validatorName];
          if (isObject(validator)) {
            validator = validator.expression;
          }

          field._asyncValidators.push((control: AbstractControl) => new Promise((resolve) => {
            return validator(control, field).then((result: boolean) => {
              resolve(result ? null : { [validatorName]: true });
              // workaround for https://github.com/angular/angular/issues/13200
              field.options._markForCheck(field);
            });
          }));
        } else {
          if (!Array.isArray(field.asyncValidators.validation)) {
            field.asyncValidators.validation = [field.asyncValidators.validation];
          }
          field.asyncValidators.validation
            .forEach((validator: any) => field._asyncValidators.push(this.wrapNgValidatorFn(field, validator) as any));
        }
      }
    }
  }

  private initPredefinedFieldValidation(field: FormlyFieldConfigCache) {
    FORMLY_VALIDATORS
      .filter(opt => (field.templateOptions && field.templateOptions.hasOwnProperty(opt)) || (field.expressionProperties && field.expressionProperties[`templateOptions.${opt}`]))
      .forEach((opt) => {
        field._validators.push((control: AbstractControl) => {
          const value = field.templateOptions[opt];
          if (value === false) {
            return null;
          }
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
        });
      });
  }

  private wrapNgValidatorFn(field: FormlyFieldConfigCache, validator: string | FieldValidatorFn) {
    validator = typeof validator === 'string'
      ? this.formlyConfig.getValidator(validator).validation
      : validator;

    return (control: AbstractControl) => (validator as FieldValidatorFn)(control, field);
  }
}
