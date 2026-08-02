import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/nativescript/form-field';

type RadioProps = FormlyFieldProps;

export interface FormlyRadioFieldConfig extends FormlyFieldConfig<RadioProps> {
  type: 'radio' | Type<FormlyFieldRadio>;
}

@Component({
  selector: 'formly-field-ns-radio',
  template: `
    @for (option of props.options | formlySelectOptions: field | async; track option) {
      <GridLayout class="input-field input-sides" rows="auto, auto" columns="*,*">
        <Label class="label" [text]="option.label"></Label>
        <Switch col="1" class="switch input" [checked]="formControl.value === option.value" (tap)="tap(option.value)">
        </Switch>
      </GridLayout>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
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
