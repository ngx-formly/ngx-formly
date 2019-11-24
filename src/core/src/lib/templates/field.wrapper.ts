import { ViewContainerRef, ViewChild } from '@angular/core';
import { FieldType } from './field.type';
import { FormlyFieldConfig } from '../models';

export abstract class FieldWrapper<F extends FormlyFieldConfig = FormlyFieldConfig> extends FieldType<F> {
  @ViewChild('fieldComponent', { read: ViewContainerRef, static: false }) fieldComponent: ViewContainerRef;
}
