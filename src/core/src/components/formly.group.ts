import { Component } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FieldType } from '../templates/field.type';

@Component({
  selector: 'formly-group',
  template: `
    <formly-form [fields]="field.fieldGroup" [model]="model" [form]="formlyGroup" [options]="newOptions" [ngClass]="field.fieldGroupClassName" [buildForm]="false"></formly-form>
  `,
})
export class FormlyGroup extends FieldType {

  get newOptions() {
    return { ...this.options };
  }

  get formlyGroup(): AbstractControl {
    if (this.field.formControl) {
      return this.field.formControl;
    } else {
      return this.form;
    }
  }
}
