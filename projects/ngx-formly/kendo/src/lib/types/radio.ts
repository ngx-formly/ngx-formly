import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-kendo-radio',
  template: `
    <ng-container *ngFor="let option of to.options; let i = index;">
      <input
        type="radio"
        [id]="id + '_' + i"
        [value]="option.value"
        [formControl]="formControl"
        [formlyAttributes]="field" class="k-radio" />
      <label class="k-radio-label" [for]="id + '_' + i">
        {{ option.label }}
      </label>
    </ng-container>
  `,
})
export class FormlyFieldRadio extends FieldType {}
