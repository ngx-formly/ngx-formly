import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'formly-field-mat-toggle',
  template: `
    <mat-slide-toggle
      [id]="id"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [color]="to.color"
      [tabIndex]="to.tabindex"
      [required]="to.required"
      [labelPosition]="to.labelPosition"
    >
      {{ to.label }}
    </mat-slide-toggle>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldToggle extends FieldType {
  @ViewChild(MatSlideToggle, { static: true }) slideToggle!: MatSlideToggle;
  defaultOptions = {
    templateOptions: {
      hideFieldUnderline: true,
      floatLabel: 'always' as const,
      hideLabel: true,
    },
  };

  onContainerClick(event: MouseEvent): void {
    this.slideToggle.focus();
    super.onContainerClick(event);
  }
}
