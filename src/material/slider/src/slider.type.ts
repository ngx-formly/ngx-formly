import { Component, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { MatSlider } from '@angular/material/slider';

@Component({
  selector: 'formly-field-mat-slider',
  template: `
    <mat-slider
      [style.width]="'100%'"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [color]="to.color">
    </mat-slider>
  `,
})
export class FormlySliderTypeComponent extends FieldType {
  @ViewChild(MatSlider) slider: MatSlider;

  onContainerClick(event: MouseEvent): void {
    this.slider.focus();
    super.onContainerClick(event);
  }
}
