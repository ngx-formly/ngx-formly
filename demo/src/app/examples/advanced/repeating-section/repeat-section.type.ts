import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

import { FormlyField } from '@ngx-formly/core';

@Component({
  selector: 'formly-repeat-section',
  template: `
    <div class="mb-3">
      @if (props.label) {
        <legend>{{ props.label }}</legend>
      }
      @if (props.description) {
        <p>{{ props.description }}</p>
      }

      @for (field of field.fieldGroup; track field; let i = $index) {
        <div class="row align-items-baseline">
          <formly-field class="col" [field]="field"></formly-field>
          <div class="col-1 d-flex align-items-center">
            <button class="btn btn-danger" type="button" (click)="remove(i)">-</button>
          </div>
        </div>
      }
      <div style="margin:30px 0;">
        <button class="btn btn-primary" type="button" (click)="add()">{{ props.addText }}</button>
      </div>
    </div>
  `,
  imports: [FormlyField],
})
export class RepeatTypeComponent extends FieldArrayType {}
