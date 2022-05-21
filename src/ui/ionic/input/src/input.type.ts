import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
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
      *ngIf="props.type !== 'number'; else numberTmp"
      [type]="props.type || 'text'"
      [formControl]="formControl"
      [ionFormlyAttributes]="field"
    ></ion-input>
    <ng-template #numberTmp>
      <ion-input type="number" [formControl]="formControl" [ionFormlyAttributes]="field"></ion-input>
    </ng-template>
  `,
  styles: [':host { display: inherit; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig<InputProps>> {}
