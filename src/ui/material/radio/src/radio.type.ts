import { Component, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { MatRadioGroup } from '@angular/material/radio';

@Component({
  selector: 'formly-field-mat-radio',
  template: `
    <mat-radio-group
      [formControl]="formControl"
      [formlyAttributes]="field"
      [tabindex]="-1">
      <mat-radio-button *ngFor="let option of to.options | formlySelectOptions:field | async; let i = index;"
        [id]="id + '_' + i"
        [color]="to.color"
        [labelPosition]="to.labelPosition"
        [value]="option.value">
        {{ option.label }}
      </mat-radio-button>
    </mat-radio-group>
  `,
})
export class FormlyFieldRadio extends FieldType {
  @ViewChild(MatRadioGroup) radioGroup!: MatRadioGroup;
  defaultOptions = {
    templateOptions: {
      hideFieldUnderline: true,
      floatLabel: 'always',
      options: [],
    },
  };

  onContainerClick(event: MouseEvent): void {
    const isRadioClick = this.radioGroup._radios
      .map(radioButton => radioButton._elementRef.nativeElement as HTMLElement)
      .some(el => el.contains(event.target as Element));

    if (!isRadioClick && this.radioGroup._radios.length && !this.radioGroup.selected) {
      this.radioGroup._radios.first.focus();
    }
    super.onContainerClick(event);
  }
}
