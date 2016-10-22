import {Component} from '@angular/core';
import { FieldType } from '../field.type';

@Component({
  selector: 'formly-field-input',
  template: `
    <input [type]="templateOptions.type" [formControl]="formControl" class="form-control" id="{{key}}"
      [placeholder]="templateOptions.placeholder"
      [formlyNgFocus]="templateOptions.focus" [ngClass]="{'form-control-danger': valid}">
    `,
})
export class FormlyFieldInput extends FieldType {
}
