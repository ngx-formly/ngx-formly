import { Component } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'formly-field-multicheckbox',
  template: `
    <div class="custom-control custom-checkbox" *ngFor="let option of to.options; let i = index;">
      <input class="custom-control-input" type="checkbox"
        [id]="id + '_' + i"
        [value]="option.value"
        [formControl]="formControl.get(option.key)"
        [formlyAttributes]="field">
      <label class="custom-control-label" [for]="id + '_' + i">
        {{ option.value }}
      </label>
    </div>
  `,
})
export class FormlyFieldMultiCheckbox extends FieldType {

  static createControl(model: any, field: FormlyFieldConfig): AbstractControl {
    if (field.templateOptions.options instanceof Observable) {
      throw new Error(`[Formly Error] You cannot pass an Observable to a multicheckbox yet.`);
    }

    const controls = field.templateOptions.options.reduce((obj, option) => {
      obj[option.key] = new FormControl(model ? model[option.key] : undefined);
      return obj;
    }, {});

    return new FormGroup(
      controls,
      field.validators ? field.validators.validation : undefined,
      field.asyncValidators ? field.asyncValidators.validation : undefined,
    );
  }

}
