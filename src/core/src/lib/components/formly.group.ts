import { Component } from '@angular/core';
import { FieldType } from '../templates/field.type';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'formly-group',
  template: `
    <formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
    <ng-content></ng-content>
  `,
  host: {
    '[class]': 'field.fieldGroupClassName || ""',
    '[style]': 'field.fieldGroupStyle? this.sanitizer.bypassSecurityTrustStyle(field.fieldGroupStyle) : ""',
  },
})
export class FormlyGroup extends FieldType {
  defaultOptions = {
    defaultValue: {},
  };

  constructor( private sanitizer: DomSanitizer ) {
    super();
  }
}
