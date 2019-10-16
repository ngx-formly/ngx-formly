import { FormlyExtension, FieldValidatorFn, FormlyConfig } from '../../services/formly.config';
import { FormlyFieldConfigCache } from '../../components/formly.field.config';
import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { isObject, FORMLY_VALIDATORS, defineHiddenProp, isUndefined, isPromise } from '../../utils';
import { isObservable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    if (!isUndefined(field['_' + type])) {
      // Avoid overriding existing validators defined through directive (https://github.com/ngx-formly/ngx-formly/issues/1578)
      if (field.formControl) {
        const validator = type === 'validators' ? field.formControl.validator : field.formControl.asyncValidator;
        if (field['_' + type] !== validator) {
          field['_' + type] = validator;
        }
      }

      return;
    }

    const validators: ValidatorFn[] = type === 'validators' ? this.getPredefinedFieldValidation(field) : [];
    if (field[type]) {
      for (const validatorName of Object.keys(field[type])) {
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

  private wrapNgValidatorFn(field: FormlyFieldConfigCache, validator: string | FieldValidatorFn, validatorName?: string) {
    return (control: AbstractControl) => {
      let validatorFn = validator as FieldValidatorFn;
      if (typeof validator === 'string') {
        validatorFn = this.formlyConfig.getValidator(validator).validation;
      }
      if (isObject(validator)) {
        validatorFn = (validator as any).expression;
      }

      const isValid = validatorFn(control, field);
      if (validatorName) {
        const handleAsyncResult = (v: boolean) => {
          return this.handleAsyncResult(field, v, { validatorName, validator });
        };

        if (isPromise(isValid)) {
          return isValid.then(handleAsyncResult);
        }

        if (isObservable(isValid)) {
          return isValid.pipe(map(handleAsyncResult));
        }

        return this.handleResult(field, isValid as any, { validatorName, validator });
      }

      return isValid;
    };
  }

  private handleAsyncResult(field: FormlyFieldConfigCache, isValid: boolean, { validatorName, validator }) {
    // workaround for https://github.com/angular/angular/issues/13200
    if (field.options && field.options._markForCheck) {
      field.options._markForCheck(field);
    }

    return this.handleResult(field, isValid, { validatorName, validator });
  }

  private handleResult(field: FormlyFieldConfigCache, isValid: boolean, { validatorName, validator }) {
    if (isObject(validator) && field.formControl && validator.errorPath) {
      const control = field.formControl.get(validator.errorPath);
      if (control) {
        const controlErrors = (control.errors || {});
        if (!isValid) {
          control.setErrors({ ...controlErrors, [validatorName]: { message: validator.message } });
        } else {
          delete controlErrors[validatorName];
          control.setErrors(Object.keys(controlErrors).length === 0 ? null : controlErrors);
        }
      }

      return isValid ? null : { [validatorName]: { errorPath: validator.errorPath } };
    }

    return isValid ? null : { [validatorName]: true };
  }
}
