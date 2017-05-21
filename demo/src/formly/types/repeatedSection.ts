import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FieldType, FormlyFormBuilder } from 'ng-formly';

@Component({
  selector: 'formly-repeat-section',
  template: `
    <div *ngFor="let control of formControl.controls; let i = index;">
      <formly-form
        [model]="model[i]"
        [fields]="fields(i)"
        [options]="newOptions"
        [form]="this.formControl.at(i)"
        [ngClass]="field.fieldArray.className">
      </formly-form>
      <div class="col-md-2">
        <button class="btn btn-danger" (click)="remove(i)">Remove</button>
      </div>
    </div>
    <div style="margin:30px 0;">
      <button class="btn btn-primary" (click)="add()">Add More Investments</button>
    </div>
  `,
})
export class RepeatComponent extends FieldType implements OnInit {
  formControl: FormArray;
  _fields = [];

  constructor(private builder: FormlyFormBuilder) {
    super();
  }

  get newOptions() {
    return Object.assign({}, this.options);
  }

  get newFields() {
    return JSON.parse(JSON.stringify(this.field.fieldArray.fieldGroup));
  }

  ngOnInit() {
    if (this.model) {
      this.model.map(() => this.add());
    }
  }

  add() {
    const form = new FormGroup({}),
      i = this._fields.length;

    if (!this.model[i]) {
      this.model.push({});
    }

    this._fields.push(this.newFields);
    this.builder.buildForm(form, this._fields[i], this.model[i], this.newOptions);
    this.formControl.push(form);
  }

  remove(i) {
    this.formControl.removeAt(i);
    this.model.splice(i, 1);
    this._fields.splice(i, 1);
  }

  fields(i) {
    if (this._fields[i]) {
      return this._fields[i];
    }

    this._fields.splice(i, 0, this.newFields);

    return this._fields[i];
  }
}
