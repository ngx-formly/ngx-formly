import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ng-zorro-antd-checkbox',
  template: `
    <label nz-checkbox [formControl]="formControl" [formlyAttributes]="field">Checkbox</label>

    <!--<input type="checkbox"-->
      <!--class="k-checkbox"-->
      <!--[class.k-state-invalid]="showError"-->
      <!--[formControl]="formControl"-->
      <!--[formlyAttributes]="field"/>-->

    <!--<label [for]="id" class="k-checkbox-label">-->
      <!--<span>{{ to.label }} <span *ngIf="to.required && to.hideRequiredMarker !== true" class="k-required">*</span></span>-->
    <!--</label>-->
  `,
})
export class FormlyFieldCheckbox extends FieldType {
}
