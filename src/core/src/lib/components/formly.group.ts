import { Component } from '@angular/core';
import { FieldType } from '../templates/field.type';

@Component({
  selector: 'formly-group',
  template: `
    <formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
    <ng-content></ng-content>
  `,
  host: {
    '[class]': 'field.fieldGroupClassName || ""',
  },
})
export class FormlyGroup extends FieldType {}
