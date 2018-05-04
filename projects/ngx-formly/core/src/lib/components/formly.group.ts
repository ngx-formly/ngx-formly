import { Component } from '@angular/core';
import { FieldType } from '../templates/field.type';

@Component({
  selector: 'formly-group',
  template: `
    <formly-form
      [fields]="field.fieldGroup"
      [isRoot]="false"
      [model]="model"
      [form]="field.formControl || form"
      [options]="options"
      [ngClass]="field.fieldGroupClassName">
      <ng-content></ng-content>
    </formly-form>
  `,
})
export class FormlyGroup extends FieldType {}
