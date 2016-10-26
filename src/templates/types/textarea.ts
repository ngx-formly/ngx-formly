import { Component, Renderer, ElementRef } from '@angular/core';
import { FieldType } from '../field.type';

@Component({
  selector: 'formly-field-textarea',
  template: `
    <textarea name="{{key}}" [formControl]="formControl" id="{{key}}" cols="{{templateOptions.cols}}"
      rows="{{templateOptions.rows}}" class="form-control"
      [formlyNgFocus]="templateOptions.focus">
    </textarea>
  `,
})
export class FormlyFieldTextArea extends FieldType {
  constructor(private renderer: Renderer, private elementRef: ElementRef) {
    super(renderer, elementRef);
  }
}
