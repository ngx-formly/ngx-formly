import { ViewContainerRef } from '@angular/core';
import { FieldType } from './field.type';
import { FormlyFieldConfig } from '../components/formly.field.config';

export abstract class FieldWrapper<F extends FormlyFieldConfig = FormlyFieldConfig> extends FieldType<F> {
  fieldComponent: ViewContainerRef;
}
