import { FormlyExtension, FieldValidatorFn, FormlyConfig } from '../../services/formly.config';
import { FormlyFieldConfigCache } from '../../components/formly.field.config';
import { AbstractControl, Validators, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { isObject, FORMLY_VALIDATORS, defineHiddenProp, isUndefined } from '../../utils';

/** @experimental */
export class FieldValidationExtension implements FormlyExtension {
  constructor(private formlyConfig: FormlyConfig) {}

  onPopulate(field: FormlyFieldConfigCache) {
    if (!field.parent) {
      return;
    }

    this.initFieldValidation(field);
    this.initFieldAsyncValidation(field);
  }

  private initFieldValidation(field: FormlyFieldConfigCache) {
    if (!isUndefined(field._validators)) {
      return;
    }

    const validators: ValidatorFn[] = this.getPredefinedFieldValidation(field);
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

          validators.push((control: AbstractControl) => {
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
            .forEach((validator: any) => validators.push(this.wrapNgValidatorFn(field, validator)));
        }
      }
    }

    defineHiddenProp(field, '_validators', Validators.compose(validators));
  }

  private initFieldAsyncValidation(field: FormlyFieldConfigCache) {
    if (!isUndefined(field._asyncValidators)) {
      return;
    }

    const validators: AsyncValidatorFn[] = [];
    if (field.asyncValidators) {
      for (const validatorName in field.asyncValidators) {
        if (validatorName !== 'validation') {
          let validator = field.asyncValidators[validatorName];
          if (isObject(validator)) {
            validator = validator.expression;
          }

          validators.push((control: AbstractControl) => new Promise((resolve) => {
            return validator(control, field).then((result: boolean) => {
              resolve(result ? null : { [validatorName]: true });
              // workaround for https://github.com/angular/angular/issues/13200
              if (field.options && field.options._markForCheck) {
                field.options._markForCheck(field);
              }
            });
          }));
        } else {
          if (!Array.isArray(field.asyncValidators.validation)) {
            field.asyncValidators.validation = [field.asyncValidators.validation];
          }
          field.asyncValidators.validation
            .forEach((validator: any) => validators.push(this.wrapNgValidatorFn(field, validator) as any));
        }
      }
    }

    defineHiddenProp(field, '_asyncValidators', Validators.composeAsync(validators));
  }

  private getPredefinedFieldValidation(field: FormlyFieldConfigCache): ValidatorFn[] {
    return FORMLY_VALIDATORS
      .filter(opt => (field.templateOptions && field.templateOptions.hasOwnProperty(opt)) || (field.expressionProperties && field.expressionProperties[`templateOptions.${opt}`]))
      .map((opt) => (control: AbstractControl) => {
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
  }

  private wrapNgValidatorFn(field: FormlyFieldConfigCache, validator: string | FieldValidatorFn) {
    validator = typeof validator === 'string'
      ? this.formlyConfig.getValidator(validator).validation
      : validator;

    return (control: AbstractControl) => (validator as FieldValidatorFn)(control, field);
  }
}
