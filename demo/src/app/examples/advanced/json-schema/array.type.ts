import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'formly-array-type',
  template: `
  <div class="mb-3">
    <legend *ngIf="to.label">{{ to.label }}</legend>
    <p *ngIf="to.description">{{ to.description }}</p>

    <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
      <formly-validation-message [field]="field"></formly-validation-message>
    </div>

    <div *ngFor="let field of field.fieldGroup;let i = index;" class="row">
      <formly-field class="col-10" [field]="field"></formly-field>
      <div class="col-2 text-right">
        <button class="btn btn-danger" type="button" (click)="remove(i)">-</button>
      </div>
    </div>

    <div class="d-flex flex-row-reverse">
      <button class="btn btn-primary" type="button" (click)="add()">+</button>
    </div>
  </div>
  `,
})
export class ArrayTypeComponent extends FieldArrayType {}
