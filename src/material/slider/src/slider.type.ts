import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';

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
export class FormlySliderTypeComponent extends FieldType {}
