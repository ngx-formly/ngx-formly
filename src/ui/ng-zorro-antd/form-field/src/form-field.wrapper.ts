import { Component } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig, FormlyFieldProps as CoreFormlyFieldProps } from '@ngx-formly/core';

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideRequiredMarker?: boolean;
  hideLabel?: boolean;
}

@Component({
  selector: 'formly-wrapper-nz-form-field',
  template: `
    <nz-form-item>
      @if (props.label && props.hideLabel !== true) {
        <nz-form-label [nzRequired]="props.required && props.hideRequiredMarker !== true" [nzFor]="id">
          @if (props.allowHtml) {
            <span [innerHTML]="props.label"></span>
          } @else {
            {{ props.label }}
          }
        </nz-form-label>
      }
      <nz-form-control
        [nzValidateStatus]="errorState"
        [nzErrorTip]="errorTpl"
        [nzExtra]="htmlDescription ? descriptionTpl : props.description"
      >
        <ng-container #fieldComponent></ng-container>
        <ng-template #descriptionTpl>
          <span [innerHTML]="props.description"></span>
        </ng-template>
        <ng-template #errorTpl let-control>
          <formly-validation-message [field]="field"></formly-validation-message>
        </ng-template>
      </nz-form-control>
    </nz-form-item>
  `,
  standalone: false,
})
export class FormlyWrapperFormField extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {
  get htmlDescription() {
    return this.props.allowHtml && typeof this.props.description === 'string' && !!this.props.description;
  }

  get errorState() {
    return this.showError ? 'error' : '';
  }
}
