import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldGroupTypeConfig } from './field.type';

/** @ignore */
@Component({
  selector: 'formly-group',
  template: `
    <formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
    <ng-content></ng-content>
  `,
  host: {
    '[class]': 'field.fieldGroupClassName || ""',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyGroup extends FieldType<FieldGroupTypeConfig> {}
