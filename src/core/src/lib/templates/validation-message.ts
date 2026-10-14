import { FormlyFieldConfig } from '../models';
import { FormlyConfig } from '../services/formly.config';
import { isObject } from '../utils';

export function getValidationMessage(field: FormlyFieldConfig, error: string, config: FormlyConfig) {
  const value = field.formControl.errors[error];
  let message = config.getValidatorMessage(error);

  if (isObject(value)) {
    if (value.errorPath) {
      return undefined;
    }

    if (value.message) {
      message = value.message;
    }
  }

  if (field.validation?.messages?.[error]) {
    message = field.validation.messages[error];
  }

  if (field.validators?.[error]?.message) {
    message = field.validators[error].message;
  }

  if (field.asyncValidators?.[error]?.message) {
    message = field.asyncValidators[error].message;
  }

  return typeof message === 'function' ? message(value, field) : message;
}
