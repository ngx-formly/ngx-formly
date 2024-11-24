import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/ionic/form-field';

type RadioProps = FormlyFieldProps;

export interface FormlyRadioFieldConfig extends FormlyFieldConfig<RadioProps> {
  type: 'radio' | Type<FormlyFieldRadio>;
}

@Component({
  selector: 'formly-field-ion-radio',
  template: `
    <ion-list>
      <ion-list-header>{{ props.label }}</ion-list-header>
      <ion-radio-group [formControl]="formControl" [ionFormlyAttributes]="field">
        <ion-item
          *ngFor="let option of props.options | formlySelectOptions: field | async"
          [disabled]="option.disabled || formControl.disabled"
        >
          <ion-radio [value]="option.value">
            {{ option.label }}
          </ion-radio>
        </ion-item>
      </ion-radio-group>
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./radio.type.scss'],
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig<RadioProps>> {}
