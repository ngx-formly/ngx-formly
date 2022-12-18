import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/ionic/form-field';

interface RadioProps extends FormlyFieldProps {}

export interface FormlyRadioFieldConfig extends FormlyFieldConfig<RadioProps> {
  type: 'radio' | Type<FormlyFieldRadio>;
}

@Component({
  selector: 'formly-field-ion-radio',
  template: `
    <ion-list>
      <ion-radio-group [formControl]="formControl" [ionFormlyAttributes]="field">
        <ion-list-header>{{ props.label }}</ion-list-header>
        <ion-item
          *ngFor="let option of props.options | formlySelectOptions : field | async"
          [disabled]="option.disabled || formControl.disabled"
        >
          <ion-label>{{ option.label }}</ion-label>
          <ion-radio [value]="option.value"></ion-radio>
        </ion-item>
      </ion-radio-group>
    </ion-list>
    <ion-item lines="none" *ngIf="showError">
      <ion-label>
        <ion-text color="danger">
          <p>
            <formly-validation-message [field]="field"></formly-validation-message>
          </p>
        </ion-text>
      </ion-label>
    </ion-item>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig<RadioProps>> {}
