import { ChangeDetectionStrategy, Component, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps, NebularCommonOptions } from '@ngx-formly/nebular/form-field';

interface RadioProps extends FormlyFieldProps, NebularCommonOptions {
  arrange?: 'horizontal' | 'vertical';
  name?: string;
}

export interface FormlyRadioFieldConfig extends FormlyFieldConfig<RadioProps> {
  type: 'radio' | Type<FormlyFieldRadio>;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'formly-radio',
  template: `
    <ng-container *ngIf="props.disabled; else elseTemplate">
      <nb-radio-group
        [formControl]="formControl"
        [name]="props.name"
        [formlyAttributes]="field"
        [required]="props.required"
        [disabled]="props.disabled"
        [status]="showError ? 'danger' : props.status"
        [ngClass]="{
          horizontal: props.arrange === 'horizontal'
        }"
      >
        <nb-radio
          *ngFor="let option of to.options | formlySelectOptions: field | async; let i = index"
          [id]="id + '_' + i"
          [value]="option.value"
        >
          {{ option.label }}
        </nb-radio>
      </nb-radio-group>
    </ng-container>
    <ng-template #elseTemplate>
      <nb-radio-group
        [formControl]="formControl"
        [name]="props.name"
        [formlyAttributes]="field"
        [required]="props.required"
        [status]="showError ? 'danger' : props.status"
        [ngClass]="{
          horizontal: props.arrange === 'horizontal'
        }"
      >
        <nb-radio
          *ngFor="let option of to.options | formlySelectOptions: field | async; let i = index"
          [id]="id + '_' + i"
          [value]="option.value"
          [disabled]="option.disabled"
        >
          {{ option.label }}
        </nb-radio>
      </nb-radio-group>
    </ng-template>
  `,
  styles: ['.horizontal { display: flex; flex-flow: row wrap; }'],
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig<RadioProps>> {
  override defaultOptions?: Partial<FieldTypeConfig<RadioProps>> = {
    props: {
      disabled: false,
      arrange: 'horizontal',
      status: 'info',
    },
  };
}
