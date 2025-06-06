import { FormlyFieldConfig } from '@ngx-formly/core';
import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

import { ArrayTypeComponent } from './array.type';
import { ObjectTypeComponent } from './object.type';
import { MultiSchemaTypeComponent } from './multischema.type';
import { NullTypeComponent } from './null.type';
import { provideHttpClient } from '@angular/common/http';

export function minItemsValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should NOT have fewer than ${field.props.minItems} items`;
}

export function maxItemsValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should NOT have more than ${field.props.maxItems} items`;
}

export function minLengthValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should NOT be shorter than ${field.props.minLength} characters`;
}

export function maxLengthValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should NOT be longer than ${field.props.maxLength} characters`;
}

export function minValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should be >= ${field.props.min}`;
}

export function maxValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should be <= ${field.props.max}`;
}

export function multipleOfValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should be multiple of ${field.props.step}`;
}

export function exclusiveMinimumValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should be > ${field.props.exclusiveMinimum}`;
}

export function exclusiveMaximumValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should be < ${field.props.exclusiveMaximum}`;
}

export function constValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should be equal to constant "${field.props.const}"`;
}

export function typeValidationMessage({ schemaType }: any) {
  return `should be "${schemaType[0]}".`;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        validationMessages: [
          { name: 'required', message: 'This field is required' },
          { name: 'type', message: typeValidationMessage },
          { name: 'minLength', message: minLengthValidationMessage },
          { name: 'maxLength', message: maxLengthValidationMessage },
          { name: 'min', message: minValidationMessage },
          { name: 'max', message: maxValidationMessage },
          { name: 'multipleOf', message: multipleOfValidationMessage },
          { name: 'exclusiveMinimum', message: exclusiveMinimumValidationMessage },
          { name: 'exclusiveMaximum', message: exclusiveMaximumValidationMessage },
          { name: 'minItems', message: minItemsValidationMessage },
          { name: 'maxItems', message: maxItemsValidationMessage },
          { name: 'uniqueItems', message: 'should NOT have duplicate items' },
          { name: 'const', message: constValidationMessage },
          { name: 'enum', message: `must be equal to one of the allowed values` },
        ],
        types: [
          { name: 'null', component: NullTypeComponent, wrappers: ['form-field'] },
          { name: 'array', component: ArrayTypeComponent },
          { name: 'object', component: ObjectTypeComponent },
          { name: 'multischema', component: MultiSchemaTypeComponent },
        ],
      },
    ]),
  ],
};
