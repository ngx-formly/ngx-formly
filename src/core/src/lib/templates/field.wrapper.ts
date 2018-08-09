import { ViewContainerRef } from '@angular/core';
import { FieldType } from './field.type';

export abstract class FieldWrapper extends FieldType {
  fieldComponent: ViewContainerRef;
}
