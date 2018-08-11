import { FormArray } from '@angular/forms';
import { FieldType } from './field.type';
import { clone, isNullOrUndefined } from '../utils';
import { FormlyFormBuilder } from '../services/formly.form.builder';

export abstract class FieldArrayType extends FieldType {
  formControl: FormArray;

  // tslint:disable-next-line
  constructor(builder: FormlyFormBuilder) {
    super();
  }

  add(i?: number, initialModel?: any) {
    i = isNullOrUndefined(i) ? this.field.fieldGroup.length : i;
    this.model.splice(i, 0, initialModel ? clone(initialModel) : undefined);

    (<any> this.options)._buildForm();
  }

  remove(i: number) {
    this.model.splice(i, 1);

    (<any> this.options)._buildForm();
  }
}
