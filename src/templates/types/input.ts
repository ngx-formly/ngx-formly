import { Component, Renderer, ElementRef } from '@angular/core';
import { FieldType } from '../field.type';

@Component({
  selector: 'formly-field-input',
  template: `
    <input [type]="templateOptions.type" [formControl]="formControl" class="form-control" id="{{key}}"
      [formlyNgFocus]="templateOptions.focus" [ngClass]="{'form-control-danger': valid}">
    `,
})
export class FormlyFieldInput extends FieldType {
  constructor(private renderer: Renderer, private elementRef: ElementRef) {
    super(renderer, elementRef);
  }
}
