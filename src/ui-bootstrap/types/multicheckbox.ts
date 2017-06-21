import { Component } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '../../core';

@Component({
  selector: 'formly-field-multicheckbox',
  template: `
    <div *ngFor="let option of to.options" class="checkbox">
        <label class="custom-control custom-checkbox">
            <input type="checkbox" [value]="option.value" [formControl]="formControl.get(option.key)"
            [formlyAttributes]="field" class="custom-control-input">
            {{ option.value }}
            <span class="custom-control-indicator"></span>
        </label>
    </div>
  `,
})
export class FormlyFieldMultiCheckbox extends FieldType {
  static createControl(model: any, field: FormlyFieldConfig): AbstractControl {
    let controlGroupConfig = field.templateOptions.options.reduce((previous, option) => {
      previous[option.key] = new FormControl(model ? model[option.key] : undefined);
      return previous;
    }, {});

    return new FormGroup(
      controlGroupConfig,
      field.validators ? field.validators.validation : undefined,
      field.asyncValidators ? field.asyncValidators.validation : undefined,
    );
  }
}
