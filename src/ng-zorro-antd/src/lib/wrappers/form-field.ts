import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-ng-zorro-antd-form-field',
  template: `
    <nz-form-item>
      <ng-container *ngIf="to.label && to.hideLabel !== true">
        <nz-form-label [nzRequired]="to.required && to.hideRequiredMarker !== true" [nzFor]="ID">{{ to.label }}</nz-form-label>
      </ng-container>
      <nz-form-control [class.has-error]="showError">
        <ng-container #fieldComponent></ng-container>
        <nz-form-explain *ngIf="showError">
          <formly-validation-message [field]="field"></formly-validation-message>
        </nz-form-explain>
      </nz-form-control>
    </nz-form-item>
  `,
  styles: [`
    .ui-messages-error {
      margin: 0;
      margin-top: 4px;
    }
  `],
})
export class FormlyWrapperFormField extends FieldWrapper {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;
}
