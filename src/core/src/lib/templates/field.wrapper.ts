import { ViewContainerRef, ViewChild } from '@angular/core';
import { FieldType } from './field.type';
import { FormlyFieldConfig } from '../components/formly.field.config';

export abstract class FieldWrapper<F extends FormlyFieldConfig = FormlyFieldConfig> extends FieldType<F> {
  // TODO: remove `any`, once dropping angular `V7` support.
  @ViewChild('fieldComponent', <any>{ read: ViewContainerRef, static: false }) fieldComponent: ViewContainerRef;
}
