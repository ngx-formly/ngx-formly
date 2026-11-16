import { Component } from '@angular/core';
import { FieldArrayType, FormlyField } from '@ngx-formly/core';

@Component({
  selector: 'formly-web-mcp-repeat',
  imports: [FormlyField],
  template: `
    @for (child of field.fieldGroup; track child; let i = $index) {
      <div class="d-flex gap-2 align-items-start">
        <formly-field class="flex-grow-1" [field]="child" />
        <button
          class="btn btn-outline-danger"
          type="button"
          (click)="remove(i)"
          [attr.aria-label]="'Remove person ' + (i + 1)"
        >
          Remove
        </button>
      </div>
    }
    <button class="btn btn-outline-primary mb-3" type="button" (click)="add()">Add person</button>
  `,
})
export class RepeatTypeComponent extends FieldArrayType {}
