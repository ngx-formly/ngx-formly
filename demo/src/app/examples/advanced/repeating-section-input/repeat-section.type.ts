import { Component } from '@angular/core';
import { FormlyField, FieldArrayType } from '@ngx-formly/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'formly-repeat-section',
  template: ` <formly-field *ngFor="let field of field.fieldGroup" [field]="field"></formly-field> `,
  standalone: true,
  imports: [NgFor, FormlyField],
})
export class RepeatTypeComponent extends FieldArrayType {}
