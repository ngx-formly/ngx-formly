import { Component } from '@angular/core';
import { FieldType } from '../../core/core';

@Component({
  selector: 'formly-field-select',
  template: `
    <select [id]="id" [formControl]="formControl" class="form-control" [formlyAttributes]="field">
      <option value="" *ngIf="templateOptions.placeholder">{{templateOptions.placeholder}}</option>
      <option *ngFor="let option of templateOptions.options" [value]="option.value">{{option.label}}</option>
    </select>
  `,
})
export class FormlyFieldSelect extends FieldType {
}
