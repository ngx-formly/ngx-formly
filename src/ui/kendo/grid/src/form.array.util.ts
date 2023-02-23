import { FormlyFieldConfig } from '@ngx-formly/core';

export function isFormlyFieldConfig(
  fieldArray:
    | FormlyFieldConfig
    | ((field: FormlyFieldConfig) => FormlyFieldConfig)
): fieldArray is FormlyFieldConfig {

  return (fieldArray as FormlyFieldConfig).fieldGroup !== undefined;
}
export function isFormlyFieldConfigFunction(
  fieldArray:
    | FormlyFieldConfig
    | ((field: FormlyFieldConfig) => FormlyFieldConfig)
): fieldArray is (field: FormlyFieldConfig) => FormlyFieldConfig {
  return (
    typeof fieldArray === 'function' &&
    (fieldArray as (field: FormlyFieldConfig) => FormlyFieldConfig) !==
      undefined
  );
}

export function isFunction(value: any) {
  return typeof value === 'function';
}
