import { ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { FieldType } from './field.type';
import { FormlyFieldConfig } from '../models';

@Directive()
export abstract class FieldWrapper<F extends FormlyFieldConfig = FormlyFieldConfig> extends FieldType<F> {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;
  @ViewChild('fieldComponent', { read: ViewContainerRef, static: true }) set _staticContent(content: ViewContainerRef) {
    this.fieldComponent = content;
  }
}
