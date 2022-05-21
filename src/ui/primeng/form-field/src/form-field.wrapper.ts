import { Component } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig, FormlyFieldProps as CoreFormlyFieldProps } from '@ngx-formly/core';

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideRequiredMarker?: boolean;
  hideLabel?: boolean;
}

@Component({
  selector: 'formly-wrapper-primeng-form-field',
  template: `
    <div class="p-field">
      <label *ngIf="props.label && props.hideLabel !== true" [for]="id">
        {{ props.label }}
        <span *ngIf="props.required && props.hideRequiredMarker !== true" aria-hidden="true">*</span>
      </label>
      <ng-container #fieldComponent></ng-container>

      <small *ngIf="showError" class="p-error">
        <formly-validation-message class="ui-message-text" [field]="field"></formly-validation-message>
      </small>
    </div>
  `,
})
export class FormlyWrapperFormField extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {}
