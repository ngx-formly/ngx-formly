import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/nativescript/form-field';

interface RadioProps extends FormlyFieldProps {}

export interface FormlyRadioFieldConfig extends FormlyFieldConfig<RadioProps> {
  type: 'radio' | Type<FormlyFieldRadio>;
}

@Component({
  selector: 'formly-field-ns-radio',
  template: `
    <ng-container *ngFor="let option of props.options | formlySelectOptions : field | async">
      <GridLayout class="input-field input-sides" rows="auto, auto" columns="*,*">
        <Label class="label" [text]="option.label"></Label>
        <Switch col="1" class="switch input" [checked]="formControl.value === option.value" (tap)="tap(option.value)">
        </Switch>
      </GridLayout>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig<RadioProps>> {
  tap(id: any) {
    const value = this.formControl.value === id ? null : id;
    setTimeout(() => {
      this.formControl.patchValue(value);
      this.formControl.markAsTouched();
    }, 100);
  }
}
