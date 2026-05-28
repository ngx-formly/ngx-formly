import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

import { FormlyField, FormlyValidationMessage } from '@ngx-formly/core';

@Component({
  selector: 'formly-array-type',
  template: `
    <div class="mb-3">
      @if (props.label) {
        <legend>{{ props.label }}</legend>
      }
      @if (props.description) {
        <p>{{ props.description }}</p>
      }
      <div class="d-flex flex-row-reverse">
        <button class="btn btn-primary" type="button" (click)="add()">+</button>
      </div>

      @if (showError && formControl.errors) {
        <div class="alert alert-danger" role="alert">
          <formly-validation-message [field]="field"></formly-validation-message>
        </div>
      }

      @for (field of field.fieldGroup; track field; let i = $index) {
        <div class="row align-items-start">
          <formly-field class="col" [field]="field"></formly-field>
          @if (field.props.removable !== false) {
            <div class="col-2 text-right">
              <button class="btn btn-danger" type="button" (click)="remove(i)">-</button>
            </div>
          }
        </div>
      }
    </div>
  `,
  imports: [FormlyField, FormlyValidationMessage],
})
export class ArrayTypeComponent extends FieldArrayType {}
