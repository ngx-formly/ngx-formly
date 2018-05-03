import { Component } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'formly-field-multicheckbox',
  template: `
    <div *ngFor="let option of to.options; let i = index;" class="checkbox">
      <label class="custom-control custom-checkbox">
        <input type="checkbox"
          [value]="option.value"
          [id]="id + '_' + i"
          [formControl]="formControl.get(option.key)"
          [formlyAttributes]="field" class="custom-control-input">
        <span class="custom-control-label">{{ option.value }}</span>
        <span class="custom-control-indicator"></span>
      </label>
    </div>
  `,
})
export class FormlyFieldMultiCheckbox extends FieldType {
  static createControl(model: any, field: FormlyFieldConfig): AbstractControl {
    if (!(field.templateOptions.options instanceof Observable)) {
      let controlGroupConfig = field.templateOptions.options.reduce((previous, option) => {
        previous[option.key] = new FormControl(model ? model[option.key] : undefined);
        return previous;
      }, {});

      return new FormGroup(
        controlGroupConfig,
        field.validators ? field.validators.validation : undefined,
        field.asyncValidators ? field.asyncValidators.validation : undefined,
      );
    } else {
      throw new Error(`[Formly Error] You cannot pass an Observable to a multicheckbox yet.`);
    }
  }
}
