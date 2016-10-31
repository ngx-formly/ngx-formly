import { Component } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FieldType } from '../templates/field.type';

@Component({
  selector: 'formly-group',
  template: `
    <formly-form [fields]="field.fieldGroup" [model]="model" [form]="formlyGroup"></formly-form>
  `,
})
export class FormlyGroup extends FieldType {
  get formlyGroup(): AbstractControl {
    if (this.field.key) {
      return this.form.get(this.field.key);
    } else {
      return this.form;
    }
  }
}
