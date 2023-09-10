import { Component, ChangeDetectionStrategy, ViewChild, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/material/form-field';
import { MatSlideToggle } from '@angular/material/slide-toggle';

interface ToggleProps extends FormlyFieldProps {
  labelPosition?: 'before' | 'after';
}

export interface FormlyToggleFieldConfig extends FormlyFieldConfig<ToggleProps> {
  type: 'toggle' | Type<FormlyFieldToggle>;
}

@Component({
  selector: 'formly-field-mat-toggle',
  template: `
    <mat-slide-toggle
      [id]="id"
      [name]="field.name"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [color]="props.color"
      [tabIndex]="props.tabindex"
      [required]="required"
      [labelPosition]="props.labelPosition"
    >
      {{ props.label }}
    </mat-slide-toggle>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldToggle extends FieldType<FieldTypeConfig<ToggleProps>> {
  @ViewChild(MatSlideToggle, { static: true }) slideToggle!: MatSlideToggle;
  override defaultOptions = {
    props: {
      hideFieldUnderline: true,
      floatLabel: 'always' as const,
      hideLabel: true,
    },
  };

  override onContainerClick(event: MouseEvent): void {
    this.slideToggle.focus();
    super.onContainerClick(event);
  }
}
