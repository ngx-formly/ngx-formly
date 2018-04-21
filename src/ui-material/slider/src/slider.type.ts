import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/material';

@Component({
  selector: 'formly-field-mat-slider',
  template: `
    <mat-slider [style.width]="'100%'" [formControl]="formControl" [formlyAttributes]="field"></mat-slider>
  `,
})
export class FormlySliderTypeComponent extends FieldType {}
