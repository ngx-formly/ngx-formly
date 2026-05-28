import { ViewContainerRef, ViewChild, Directive, QueryList } from '@angular/core';
import { FieldType } from './field.type';
import { FormlyFieldConfig } from '../models';
import { NgControl } from '@angular/forms';

@Directive()
export abstract class FieldWrapper<F extends FormlyFieldConfig = FormlyFieldConfig> extends FieldType<F> {
  override set _formlyControls(_: QueryList<NgControl>) {}
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent!: ViewContainerRef;
  @ViewChild('fieldComponent', { read: ViewContainerRef, static: true }) set _staticContent(content: ViewContainerRef) {
    this.fieldComponent = content;
  }
}
