import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-ng-zorro-antd-form-field',
  template: `
    <nz-form-item>
      <nz-form-label
        *ngIf="to.label && !to.hideLabel"
        [nzRequired]="to.required && !to.hideRequiredMarker"
        [nzSpan]="nzLabelSpan"
      >
        {{ to.label }}
      </nz-form-label>
      <nz-form-control [nzSpan]="nzControlSpan">
        <ng-template #fieldComponent></ng-template>
      </nz-form-control>
    </nz-form-item>
    <nz-form-explain *ngIf="showError">
      <formly-validation-message [field]="field"></formly-validation-message>
    </nz-form-explain>
  `,
})
export class FormlyWrapperFormField extends FieldWrapper {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;

  get nzLabelSpan() {
    return this.to!.nzLabelSpan || null;
  }

  get nzControlSpan() {
    return this.to!.nzControlSpan || null;
  }
}
