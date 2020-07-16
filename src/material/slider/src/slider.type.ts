import { Component, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { MatSlider, MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'formly-field-mat-slider',
  template: `
    <mat-slider
      [id]="id"
      [style.width]="'100%'"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [tabindex]="to.tabindex"
      [color]="to.color"
      [thumbLabel]="to.thumbLabel"
      [step]="to.step"
      [max]="to.max"
      [min]="to.min"
      (change)="change($event)">
    </mat-slider>
  `,
})
export class FormlySliderTypeComponent extends FieldType {
  @ViewChild(MatSlider) slider!: MatSlider;
  defaultOptions = {
    templateOptions: {
      hideFieldUnderline: true,
      floatLabel: 'always',
      thumbLabel: false,
    },
  };

  onContainerClick(event: MouseEvent): void {
    this.slider.focus();
    super.onContainerClick(event);
  }

  change($event: MatSliderChange) {
    if (this.to.change) {
      this.to.change(this.field, $event);
    }
  }
}
