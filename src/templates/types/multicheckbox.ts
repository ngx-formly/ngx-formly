
import {Component} from '@angular/core';
import {FormGroup, FormControl, AbstractControl} from '@angular/forms';
import {FormlyFieldConfig} from '../../components/formly.field.config';
import { FieldType } from '../field.type';

@Component({
  selector: 'formly-field-multicheckbox',
  template: `
    <div *ngFor="let option of templateOptions.options" class="checkbox">
        <label class="custom-control custom-checkbox">
            <input type="checkbox" name="choose" value="{{option.value}}" [formControl]="formControl.get(option.key)"
            class="custom-control-input">
            {{option.value}}
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

    return new FormGroup(controlGroupConfig);
  }
}
