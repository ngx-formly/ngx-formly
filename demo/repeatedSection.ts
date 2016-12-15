import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '../src/index';
import { clone } from '../src/core/utils';

@Component({
  selector: 'formly-repeat-section',
  template: `
    <div *ngFor="let control of formControl.controls; let i = index;">
      <formly-form
        [model]="model[i]"
        [fields]="fields"
        [options]="newOptions"
        [form]="control"
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

  get newOptions() {
    return clone(this.options);
  }

  get fields(): FormlyFieldConfig[] {
    return this.field.fieldArray.fieldGroup;
  }

  ngOnInit() {
    if (this.model) {
      this.model.map(() => {
        (<FormArray>this.formControl).push(new FormGroup({}));
      });
    }
  }

  add() {
    this.model.push({});
    (<FormArray>this.formControl).push(new FormGroup({}));
  }

  remove(i) {
    (<FormArray>this.formControl).removeAt(i);
    this.model.splice(i, 1);
  }
}
