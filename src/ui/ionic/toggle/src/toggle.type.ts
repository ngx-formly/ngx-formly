import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/ionic/form-field';

interface ToggleProps extends FormlyFieldProps {}

export interface FormlyToggleFieldConfig extends FormlyFieldConfig<ToggleProps> {
  type: 'toggle' | Type<FormlyFieldToggle>;
}

@Component({
  selector: 'formly-field-ion-toggle',
  template: `
    <ion-toggle [formControl]="formControl" [ionFormlyAttributes]="field">
      {{ props.label }}
    </ion-toggle>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldToggle extends FieldType<FieldTypeConfig<ToggleProps>> {}
