import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-primeng-select',
  template: `
    <p-dropdown
      [class.ng-dirty]="showError"
      [placeholder]="to.placeholder"
      [options]="to.options | formlySelectOptions:field | async"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [showClear]="!to.required">
    </p-dropdown>
  `,
})
export class FormlyFieldSelect extends FieldType {}
