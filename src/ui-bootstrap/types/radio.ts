import { Component } from '@angular/core';
import { FormArray, FormControl, AbstractControl } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '../../core/core';

@Component({
  selector: 'formly-field-radio',
  template: `
    <div [formGroup]="formControl">
    <div *ngFor="let option of templateOptions.options; let i = index" class="radio">
      <label class="custom-control custom-radio">
        <input [id]="id" type="radio" [value]="option.key" [attr.name]="key" [formControlName]="i"
        [formlyAttributes]="templateOptions" class="custom-control-input">
        {{option.value}}
        <span class="custom-control-indicator"></span>
      </label>
    </div>
    </div>
  `,
})
export class FormlyFieldRadio extends FieldType {
  static createControl(model: any, field: FormlyFieldConfig): AbstractControl {
    let controls = [];

    field.templateOptions.options.forEach((option) => {
      controls.push(new FormControl(model));
    });

    return new FormArray(controls);
  }
}
