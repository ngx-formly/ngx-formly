import {ViewContainerRef} from '@angular/core';
import {Field} from './field';

export abstract class FieldWrapper extends Field {
  fieldComponent: ViewContainerRef;
}
