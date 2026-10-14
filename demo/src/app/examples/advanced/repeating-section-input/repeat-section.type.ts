import { Component } from '@angular/core';
import { FormlyField, FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'formly-repeat-section',
  template: `
    @for (field of field.fieldGroup; track field) {
      <formly-field [field]="field"></formly-field>
    }
  `,
  imports: [FormlyField],
})
export class RepeatTypeComponent extends FieldArrayType {}
