import { Component } from '@angular/core';
import { FieldType } from '../../core/core';

@Component({
  selector: 'formly-field-radio',
  template: `
    <div [formGroup]="form">
      <div *ngFor="let option of to.options" class="radio">
        <label class="custom-control custom-radio">
          <input [id]="id" type="radio" [value]="option.key" [formControlName]="key"
          [formlyAttributes]="field" class="custom-control-input">
          {{option.value}}
          <span class="custom-control-indicator"></span>
        </label>
      </div>
    </div>
  `,
})
export class FormlyFieldRadio extends FieldType {}
