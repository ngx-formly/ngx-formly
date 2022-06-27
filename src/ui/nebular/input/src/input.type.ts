import { ChangeDetectionStrategy, Component, Type } from '@angular/core';
import { FieldType, FormlyFieldProps, FormlyFieldConfig, FieldTypeConfig } from '@ngx-formly/core';
import { NebularCommonOptions } from '@ngx-formly/nebular/form-field';

interface InputProps extends FormlyFieldProps, NebularCommonOptions {
  fullWidth?: boolean;
}

export interface FormlyInputFieldConfig extends FormlyFieldConfig<InputProps> {
  type: 'input' | Type<FormlyFieldInput>;
}

@Component({
  selector: 'formly-field-input',
  template: `
    <input
      nbInput
      *ngIf="type !== 'number'; else numbTemplate"
      [type]="type"
      [formControl]="formControl"
      [fullWidth]="props.fullWidth || false"
      [formlyAttributes]="field"
      [status]="showError ? 'danger' : props.status"
      [shape]="props.shape"
      [fieldSize]="props.size"
      [placeholder]="props.placeholder"
    />
    <ng-template #numbTemplate>
      <input
        nbInput
        type="number"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [fullWidth]="props.fullWidth || false"
        [status]="showError ? 'danger' : props.status"
        [shape]="props.shape"
        [fieldSize]="props.size"
        [placeholder]="props.placeholder"
      />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig<InputProps>> {
  override defaultOptions?: Partial<FieldTypeConfig<InputProps>> = {
    props: {
      status: 'info',
      shape: 'rectangle',
      size: 'medium',
    },
  };
  get type(): string {
    return this.props.type || 'text';
  }
}
