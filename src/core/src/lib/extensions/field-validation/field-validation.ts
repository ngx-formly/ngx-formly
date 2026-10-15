import { FormlyConfig } from '../../services/formly.config';
import { FormlyExtension, ValidatorOption, FormlyFieldConfigCache } from '../../models';
import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { FORMLY_VALIDATORS, defineHiddenProp, isPromise, observe, clone, isObject, hasKey } from '../../utils';
import { updateValidity } from '../field-form/utils';
import { parseExpression } from '../field-expression/utils';
import { isObservable } from 'rxjs';
import { map } from 'rxjs/operators';

export class FieldValidationExtension implements FormlyExtension {
  constructor(private config: FormlyConfig) {}

  onPopulate(field: FormlyFieldConfigCache) {
    this.initFieldValidation(field, 'validators');
    this.initFieldValidation(field, 'asyncValidators');
  }

  private initFieldValidation(field: FormlyFieldConfigCache, type: 'validators' | 'asyncValidators') {
    const validators: ValidatorFn[] = [];
    if (type === 'validators' && !(field.hasOwnProperty('fieldGroup') && !hasKey(field))) {
      validators.push(this.getPredefinedFieldValidation(field));
    }

    if (field[type]) {
      for (const validatorName of Object.keys(field[type])) {
        validatorName === 'validation'
          ? validators.push(...field[type].validation.map((v: any) => this.wrapNgValidatorFn(field, v)))
          : validators.push(this.wrapNgValidatorFn(field, field[type][validatorName], validatorName));
      }
    }

    defineHiddenProp(field, '_' + type, validators);
  }

  private getPredefinedFieldValidation(field: FormlyFieldConfigCache): ValidatorFn {
    let VALIDATORS: string[] = [];
    FORMLY_VALIDATORS.forEach((opt) =>
      observe(field, ['props', opt], ({ currentValue, firstChange }) => {
        VALIDATORS = VALIDATORS.filter((o) => o !== opt);
        if (opt === 'required' && currentValue != null && typeof currentValue !== 'boolean') {
          console.warn(
            `Formly: Invalid prop 'required' of type '${typeof currentValue}', expected 'boolean' (Field:${
              field.key
            }).`,
          );
        }

        if (currentValue != null && currentValue !== false) {
          VALIDATORS.push(opt);
        }
        if (!firstChange && field.formControl) {
          updateValidity(field.formControl);
        }
      }),
    );

    return (control: AbstractControl) => {
      if (VALIDATORS.length === 0) {
        return null;
      }

      return Validators.compose(
        VALIDATORS.map((opt) => () => {
          const value = field.props[opt];
          switch (opt) {
            case 'required':
              return Validators.required(control);
            case 'pattern':
              return Validators.pattern(value)(control);
            case 'minLength':
              const minLengthResult = Validators.minLength(value)(control);
              const minLengthKey =
                this.config.getValidatorMessage('minlength') || field.validation?.messages?.minlength
                  ? 'minlength'
                  : 'minLength';

              return minLengthResult ? { [minLengthKey]: minLengthResult.minlength } : null;
            case 'maxLength':
              const maxLengthResult = Validators.maxLength(value)(control);
              const maxLengthKey =
                this.config.getValidatorMessage('maxlength') || field.validation?.messages?.maxlength
                  ? 'maxlength'
                  : 'maxLength';

              return maxLengthResult ? { [maxLengthKey]: maxLengthResult.maxlength } : null;
            case 'min':
              return Validators.min(value)(control);
            case 'max':
              return Validators.max(value)(control);
            case 'step': {
              // JSON Schema multipleOf validates against zero, independently of min.
              if (
                field.validators?.multipleOf ||
                typeof control.value !== 'number' ||
                !Number.isFinite(value) ||
                value <= 0
              ) {
                return null;
              }

              const base = Number.isFinite(field.props.min) ? field.props.min : 0;
              const error = { step: { step: value, base, actual: control.value } };
              if (!Number.isFinite(control.value)) {
                return error;
              }

              // Scale decimal representations to integers without rounding away extra digits.
              const decimals = [control.value, value, base].map((n) => {
                const [coefficient, exponent = '0'] = n.toString().split('e');
                const [integer, fraction = ''] = coefficient.split('.');
                return { digits: BigInt(integer + fraction), exponent: Number(exponent) - fraction.length };
              });
              const exponent = Math.min(...decimals.map((n) => n.exponent));
              const [actual, step, start] = decimals.map((n) => n.digits * 10n ** BigInt(n.exponent - exponent));

              return (actual - start) % step === 0n ? null : error;
            }
            default:
              return null;
          }
        }),
      )!(control);
    };
  }

  private wrapNgValidatorFn(field: FormlyFieldConfigCache, validator: any, validatorName?: string) {
    let validatorOption: ValidatorOption;
    if (typeof validator === 'string') {
      validatorOption = clone(this.config.getValidator(validator));
    }

    if (typeof validator === 'object' && validator.name) {
      validatorOption = clone(this.config.getValidator(validator.name));
      if (validator.options) {
        validatorOption.options = validator.options;
      }
    }

    if (typeof validator === 'object' && 'expression' in validator) {
      const { expression, ...options } = validator;
      let validation = expression;
      if (typeof expression === 'string') {
        const evaluate = parseExpression(expression, ['model', 'formState', 'field', 'control']);
        if (!evaluate) {
          throw new Error(`[Formly Error] Invalid validation expression for "${validatorName}": ${expression}`);
        }

        validation = (control: AbstractControl, field: FormlyFieldConfigCache) =>
          evaluate(field.model, field.options.formState, field, control);
      }

      validatorOption = {
        name: validatorName,
        validation,
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
      const errors: any = validatorOption.validation(control, field, validatorOption.options);
      if (isPromise(errors)) {
        return errors.then((v) => this.handleResult(field, validatorName ? !!v : v, validatorOption));
      }

      if (isObservable(errors)) {
        return errors.pipe(map((v) => this.handleResult(field, validatorName ? !!v : v, validatorOption)));
      }

      return this.handleResult(field, validatorName ? !!errors : errors, validatorOption);
    };
  }

  private handleResult(field: FormlyFieldConfigCache, errors: any, { name, options }: ValidatorOption) {
    if (typeof errors === 'boolean') {
      errors = errors ? null : { [name]: options ? options : true };
    }

    const ctrl = field.formControl;
    ctrl?._childrenErrors?.[name]?.();

    if (isObject(errors)) {
      Object.keys(errors).forEach((name) => {
        const errorPath = errors[name].errorPath ? errors[name].errorPath : options?.errorPath;

        const childCtrl = errorPath ? field.formControl.get(errorPath) : null;
        if (childCtrl) {
          const { errorPath: _errorPath, ...opts } = errors[name];
          childCtrl.setErrors({ ...(childCtrl.errors || {}), [name]: opts });

          !ctrl._childrenErrors && defineHiddenProp(ctrl, '_childrenErrors', {});
          ctrl._childrenErrors[name] = () => {
            const { [name]: _toDelete, ...childErrors } = childCtrl.errors || {};
            childCtrl.setErrors(Object.keys(childErrors).length === 0 ? null : childErrors);
          };
        }
      });
    }

    return errors;
  }
}
