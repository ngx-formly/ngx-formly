import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ng-zorro-antd-radio',
  template: `
    <nz-radio-group [formControl]="formControl">
      <label nz-radio *ngFor="let option of to.options | formlySelectOptions: field | async" [nzValue]="option.value">
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
