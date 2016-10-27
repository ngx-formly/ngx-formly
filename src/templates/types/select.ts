import { Component } from '@angular/core';
import { FieldType } from '../field.type';

@Component({
  selector: 'formly-field-select',
  template: `
    <select [id]="key" [formControl]="formControl" class="form-control" [formlyAttributes]="templateOptions">
      <option value="" *ngIf="templateOptions.placeholder">{{templateOptions.placeholder}}</option>
      <option *ngFor="let option of templateOptions.options" [value]="option.value">{{option.label}}</option>
    </select>
  `,
})
export class FormlyFieldSelect extends FieldType {
}
