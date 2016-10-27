import { Component } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';
import { FormlyFieldConfig } from '../../components/formly.field.config';
import { FieldType } from '../field.type';

@Component({
  selector: 'formly-field-checkbox',
  template: `
    <label class="custom-control custom-checkbox">
      <input [id]="id" type="checkbox" [formControl]="formControl"
        *ngIf="!templateOptions.hidden" value="on"
        [formlyAttributes]="templateOptions" class="custom-control-input">
        {{templateOptions.label}}
        <span class="custom-control-indicator"></span>
    </label>
  `,
})
export class FormlyFieldCheckbox extends FieldType {
  static createControl(model: any, field: FormlyFieldConfig): AbstractControl {
    return new FormControl(
      { value: model ? 'on' : undefined, disabled: field.templateOptions.disabled },
      field.validators ? field.validators.validation : undefined,
      field.asyncValidation,
    );
  }
}
