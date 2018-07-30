import { FormArray } from '@angular/forms';
import { FieldType } from './field.type';
import { clone, isNullOrUndefined } from '../utils';
import { FormlyFormBuilder } from '../services/formly.form.builder';

export abstract class FieldArrayType extends FieldType {
  formControl: FormArray;

 constructor(private builder: FormlyFormBuilder) {
    super();
  }

  add(i?: number, initialModel?: any) {
    i = isNullOrUndefined(i) ? this.field.fieldGroup.length : i;

    this.model.splice(i, 0, initialModel ? clone(initialModel) : undefined);
    this.field.fieldGroup.splice(i, 0, { ...clone(this.field.fieldArray) });

    this.field.fieldGroup.forEach((field, index) => {
      field.key = `${index}`;
    });

    const form = new FormArray([]);
    this.builder.buildForm(form, [this.field.fieldGroup[i]], this.model, this.options);
    this.formControl.insert(i, form.at(0));

    (<any> this.options).resetTrackModelChanges();
  }

  remove(i: number) {
    this.formControl.removeAt(i);
    this.field.fieldGroup.splice(i, 1);
    this.field.fieldGroup.forEach((f, index) => f.key = `${index}`);
    this.model.splice(i, 1);
    (<any> this.options).resetTrackModelChanges();
  }

  reset() {
    this.field.fieldGroup.length = 0;
    this.model.length = 0;
    const formControl = <FormArray> this.field.formControl;
    while (formControl.length !== 0) {
      formControl.removeAt(0);
    }
  }
}
