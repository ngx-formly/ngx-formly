import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FieldTypeConfig } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { MatSlider } from '@angular/material/slider';

@Component({
  selector: 'formly-field-mat-slider',
  template: `
    <mat-slider
      [id]="id"
      [style.width]="'100%'"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [tabIndex]="props.tabindex"
      [color]="props.color"
      [displayWith]="props.displayWith"
      [invert]="props.invert"
      [max]="props.max"
      [min]="props.min"
      [step]="props.step"
      [thumbLabel]="props.thumbLabel"
      [tickInterval]="props.tickInterval"
      [valueText]="props.valueText"
      [vertical]="props.vertical"
      (input)="props.input && props.input(field, $event)"
      (change)="props.change && props.change(field, $event)"
    >
    </mat-slider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSlider extends FieldType<FieldTypeConfig> {
  @ViewChild(MatSlider, { static: true }) slider!: MatSlider;
  override defaultOptions = {
    props: {
      hideFieldUnderline: true,
      floatLabel: 'always' as const,
      thumbLabel: false,
    },
  };

  override onContainerClick(event: MouseEvent): void {
    this.slider.focus();
    super.onContainerClick(event);
  }
}
