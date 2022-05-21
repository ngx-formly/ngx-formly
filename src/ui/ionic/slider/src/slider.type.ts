import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/ionic/form-field';

interface SliderProps extends FormlyFieldProps {}

export interface FormlySliderFieldConfig extends FormlyFieldConfig<SliderProps> {
  type: 'slider' | Type<FormlyFieldSlider>;
}

@Component({
  selector: 'formly-field-ion-range',
  template: `
    <ion-range [min]="props.min" [max]="props.max" [formControl]="formControl" [ionFormlyAttributes]="field">
      <ion-label slot="start">{{ props.min }}</ion-label>
      <ion-label slot="end">{{ props.max }}</ion-label>
    </ion-range>
  `,
  styles: [':host { display: inherit; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSlider extends FieldType<FieldTypeConfig<SliderProps>> {}
