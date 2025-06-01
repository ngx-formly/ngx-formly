import { ChangeDetectionStrategy, Component, Type } from '@angular/core';

import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/ionic/form-field';

interface InputProps extends FormlyFieldProps {}

export interface FormlyInputFieldConfig extends FormlyFieldConfig<InputProps> {
  type: 'input' | Type<FormlyFieldInput>;
}

@Component({
  selector: 'formly-field-ion-input',
  template: `
    <ion-input
      [type]="props.type || 'text'"
      [label]="props.label"
      [labelPlacement]="props.labelPosition"
      [formControl]="formControl"
      [ionFormlyAttributes]="field"
    ></ion-input>
  `,
  styles: [':host { display: inherit; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig<InputProps>> {}
