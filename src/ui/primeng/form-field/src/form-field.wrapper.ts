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
      @if (props.label && props.hideLabel !== true) {
        <label [for]="id">
          {{ props.label }}
          @if (props.required && props.hideRequiredMarker !== true) {
            <span aria-hidden="true">*</span>
          }
        </label>
      }
      <ng-container #fieldComponent></ng-container>

      @if (showError) {
        <small class="p-error">
          <formly-validation-message class="ui-message-text" [field]="field"></formly-validation-message>
        </small>
      }
    </div>
  `,
  standalone: false,
})
export class FormlyWrapperFormField extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {}
