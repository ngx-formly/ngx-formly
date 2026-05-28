import { ChangeDetectionStrategy, Component, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/ng-zorro-antd/form-field';

interface InputProps extends FormlyFieldProps {}

export interface FormlyInputFieldConfig extends FormlyFieldConfig<InputProps> {
  type: 'input' | Type<FormlyFieldInput>;
}

@Component({
  selector: 'formly-field-nz-input',
  template: `
    <input
      *ngIf="props.type !== 'number'; else numberTmp"
      nz-input
      [formControl]="formControl"
      [type]="props.type || 'text'"
      [formlyAttributes]="field"
    />
    <ng-template #numberTmp>
      <nz-input-number
        [formControl]="formControl"
        [formlyAttributes]="field"
        [nzFormatter]="nzFormatter"
      ></nz-input-number>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig<InputProps>> {
  nzFormatter = (value: number) => value?.toString() || '';
}
