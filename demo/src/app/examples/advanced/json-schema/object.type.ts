import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-object-type',
  template: `
    <legend *ngIf="to.label">{{ to.label }}</legend>
    <p *ngIf="to.description">{{ to.description }}</p>
    <formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
  `,
})
export class ObjectTypeComponent extends FieldType {
    defaultOptions = {
        defaultValue: {},
    };
}
