import { Component } from '@angular/core';
import { FieldType } from '../../core';

@Component({
  selector: 'formly-field-radio',
  template: `
    <div [formGroup]="form">
      <div *ngFor="let option of to.options" class="radio">
        <label class="custom-control custom-radio">
          <input [name]="id" type="radio" [value]="option.key" [formControl]="formControl"
          [formlyAttributes]="field" class="custom-control-input">
          {{option.value}}
          <span class="custom-control-indicator"></span>
        </label>
      </div>
    </div>
  `,
})
export class FormlyFieldRadio extends FieldType {}
