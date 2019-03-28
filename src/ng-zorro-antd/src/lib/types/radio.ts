import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-nz-zorro-antd-radio',
  template: `
    <nz-radio-group [nzName]="id">
      <label
        nz-radio
        *ngFor="let option of to.options | formlySelectOptions: field | async"
        [class.ng-dirty]="showError"
        [formControl]="formControl"
        [nzValue]="option.value"
      >
        {{ option.label }}
      </label>
    </nz-radio-group>
  `,
})
export class FormlyFieldRadio extends FieldType {
  defaultOptions = {
    templateOptions: { options: [] },
  };
}
