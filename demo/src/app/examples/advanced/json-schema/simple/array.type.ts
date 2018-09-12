import { Component } from '@angular/core';
import { FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';

@Component({
  selector: 'formly-array-type',
  template: `
    <legend *ngIf="to.label">{{ to.label }}</legend>
    <div *ngFor="let field of field.fieldGroup;let i = index;" class="row">
      <formly-field class="col-sm-10" [field]="field"></formly-field>
      <div class="col-sm-2">
        <button class="btn btn-danger" type="button" (click)="remove(i)">Remove</button>
      </div>
    </div>
    <div class="text-right">
      <button class="btn btn-primary" type="button" (click)="add()">Add</button>
    </div>
  `,
})
export class ArrayTypeComponent extends FieldArrayType {
  constructor(builder: FormlyFormBuilder) {
    super(builder);
  }
}
