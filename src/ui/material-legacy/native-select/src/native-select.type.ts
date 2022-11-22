import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldSelectProps } from '@ngx-formly/core/select';
import { FieldType, FormlyFieldProps } from '@ngx-formly/material/form-field';

interface NativeSelectProps extends FormlyFieldProps, FormlyFieldSelectProps {}

export interface FormlyNativeSelectFieldConfig extends FormlyFieldConfig<NativeSelectProps> {
  type: 'native-select' | Type<FormlyFieldNativeSelect>;
}

@Component({
  selector: 'formly-field-mat-native-select',
  template: `
    <select
      matNativeControl
      [id]="id"
      [readonly]="props.readonly"
      [required]="required"
      [errorStateMatcher]="errorStateMatcher"
      [formControl]="formControl"
      [formlyAttributes]="field"
    >
      <option *ngIf="props.placeholder" [ngValue]="undefined">{{ props.placeholder }}</option>
      <ng-container *ngIf="props.options | formlySelectOptions: field | async as opts">
        <ng-container *ngFor="let opt of opts">
          <option *ngIf="!opt.group; else optgroup" [ngValue]="opt.value" [disabled]="opt.disabled">
            {{ opt.label }}
          </option>
          <ng-template #optgroup>
            <optgroup [label]="opt.label">
              <option *ngFor="let child of opt.group" [ngValue]="child.value" [disabled]="child.disabled">
                {{ child.label }}
              </option>
            </optgroup>
          </ng-template>
        </ng-container>
      </ng-container>
    </select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldNativeSelect extends FieldType<FieldTypeConfig<NativeSelectProps>> {}
