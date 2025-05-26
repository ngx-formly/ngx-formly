import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldGroupTypeConfig } from './field.type';

/** @ignore */
@Component({
  selector: 'formly-group',
  template: `
    @for (f of field.fieldGroup; track $index) {
      <formly-field [field]="f"></formly-field>
    }
    <ng-content></ng-content>
  `,
  host: {
    '[class]': 'field.fieldGroupClassName || ""',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyGroup extends FieldType<FieldGroupTypeConfig> {}
