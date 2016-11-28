import { Component } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FieldType } from '../templates/field.type';
import { clone } from '../utils';

@Component({
  selector: 'formly-group',
  template: `
    <formly-form [fields]="field.fieldGroup" [model]="model" [form]="formlyGroup" [options]="newOptions" [ngClass]="field.className"></formly-form>
  `,
})
export class FormlyGroup extends FieldType {

  get newOptions() {
    return clone(this.options);
  }

  get formlyGroup(): AbstractControl {
    if (this.field.key) {
      return this.form.get(this.field.key);
    } else {
      return this.form;
    }
  }
}
