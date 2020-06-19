import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-kendo-radio',
  template: `
    <ng-container *ngFor="let option of to.options | formlySelectOptions: field | async; let i = index">
      <input
        type="radio"
        [id]="id + '_' + i"
        [name]="field.name || id"
        [value]="option.value"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [attr.disabled]="option.disabled || formControl.disabled ? true : null"
        class="k-radio"
      />
      <label class="k-radio-label" [for]="id + '_' + i">
        {{ option.label }}
      </label>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldRadio extends FieldType {
  defaultOptions = {
    templateOptions: { options: [] },
  };
}
