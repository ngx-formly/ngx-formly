import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
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
      [tabIndex]="to.tabindex"
      [color]="to.color"
      [displayWith]="to.displayWith"
      [invert]="to.invert"
      [max]="to.max"
      [min]="to.min"
      [step]="to.step"
      [thumbLabel]="to.thumbLabel"
      [tickInterval]="to.tickInterval"
      [valueText]="to.valueText"
      [vertical]="to.vertical"
      (input)="to.input && to.input(field, $event)"
      (change)="to.change && to.change(field, $event)"
    >
    </mat-slider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSlider extends FieldType {
  @ViewChild(MatSlider, { static: true }) slider!: MatSlider;
  defaultOptions = {
    templateOptions: {
      hideFieldUnderline: true,
      floatLabel: 'always' as const,
      thumbLabel: false,
    },
  };

  onContainerClick(event: MouseEvent): void {
    this.slider.focus();
    super.onContainerClick(event);
  }
}
