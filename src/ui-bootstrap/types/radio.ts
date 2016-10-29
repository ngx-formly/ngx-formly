import { Component } from '@angular/core';
import { FieldType } from '../../core/core';

@Component({
  selector: 'formly-field-radio',
  template: `
    <div *ngFor="let option of templateOptions.options" class="radio">
      <label class="custom-control custom-radio">
        <input [id]="id" type="radio" [value]="option.key" [formControl]="form.get(key)"
        [formlyAttributes]="templateOptions" class="custom-control-input">
        {{option.value}}
        <span class="custom-control-indicator"></span>
      </label>
    </div>
  `,
})
export class FormlyFieldRadio extends FieldType {
}
