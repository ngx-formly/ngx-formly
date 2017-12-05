import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FieldType, FormlyFormBuilder } from '@ngx-formly/core';
import * as clonedeep from 'lodash.clonedeep';

@Component({
  selector: 'formly-repeat-section',
  template: `
    <div *ngFor="let control of formControl.controls; let i = index;">
      <formly-form
        [model]="model[i]"
        [fields]="fields[i]"
        [options]="options"
        [form]="this.formControl.at(i)"
        [ngClass]="field.fieldArray.fieldGroupClassName">
      </formly-form>
      <div class="col-md-2">
        <button class="btn btn-danger" type="button" (click)="remove(i)">Remove</button>
      </div>
    </div>
    <div style="margin:30px 0;">
      <button class="btn btn-primary" type="button" (click)="add()">Add More Investments</button>
    </div>
  `,
})
export class RepeatTypeComponent extends FieldType implements OnInit {
  formControl: FormArray;
  fields = [];

  constructor(private builder: FormlyFormBuilder) {
    super();
  }

  get newFields() {
    return clonedeep(this.field.fieldArray.fieldGroup);
  }

  ngOnInit() {
    if (this.model) {
      this.model.map(() => this.add());
    }
  }

  add() {
    const form = new FormGroup({}),
      i = this.fields.length;

    if (!this.model[i]) {
      this.model.push({});
    }

    this.fields.push(this.newFields);
    this.builder.buildForm(form, this.fields[i], this.model[i], this.options);
    this.formControl.push(form);
  }

  remove(i) {
    this.formControl.removeAt(i);
    this.model.splice(i, 1);
    this.fields.splice(i, 1);
  }
}
