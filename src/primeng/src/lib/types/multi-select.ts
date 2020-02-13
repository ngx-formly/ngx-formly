import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-primeng-multi-select',
  template: `
    <p-multiSelect
      [class.ng-dirty]="showError"
      [filterPlaceHolder]="to.placeholder"
      [options]="to.options | formlySelectOptions:field | async"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [filter]="to.filterable"
      (onChange)="to.change && to.change(field, $event)">
    </p-multiSelect>        
  `,
})
export class FormlyFieldMultiSelect extends FieldType {
  defaultOptions = {
    templateOptions: { options: [] },
  };
  constructor(){
    super();
  }
}
