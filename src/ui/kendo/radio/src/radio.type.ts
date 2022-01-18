import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FieldTypeConfig } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/kendo/form-field';

@Component({
  selector: 'formly-field-kendo-radio',
  template: `
    <ng-container *ngFor="let option of to.options | formlySelectOptions: field | async; let i = index">
      <input
        type="radio"
        #radioInput
        kendoRadioButton
        [id]="id + '_' + i"
        [name]="field.name || id"
        [value]="option.value"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [attr.disabled]="option.disabled || formControl.disabled ? true : null"
      />
      <label class="k-radio-label" [for]="id + '_' + i">
        {{ option.label }}
      </label>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./radio.type.scss'],
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig> {}
