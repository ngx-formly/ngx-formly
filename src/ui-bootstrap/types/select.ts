import { Component } from '@angular/core';
import { FieldType } from '../../core/core';

@Component({
  selector: 'formly-field-select',
  template: `
    <select [id]="id" [formControl]="formControl" class="form-control" [formlyAttributes]="field">
      <option value="" *ngIf="to.placeholder">{{to.placeholder}}</option>
      <option *ngFor="let option of to.options" [value]="option.value">{{option.label}}</option>
    </select>
  `,
})
export class FormlyFieldSelect extends FieldType {
}
