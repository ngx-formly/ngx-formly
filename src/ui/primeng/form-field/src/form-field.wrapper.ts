import { Component } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig, FormlyFieldProps as CoreFormlyFieldProps } from '@ngx-formly/core';

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideRequiredMarker?: boolean;
  hideLabel?: boolean;
}

@Component({
  selector: 'formly-wrapper-primeng-form-field',
  template: `
    <div class="p-field field">
      @if (props.label && props.hideLabel !== true) {
        <label [for]="id">
          @if (props.allowHtml) {
            <span [innerHTML]="props.label"></span>
          } @else {
            {{ props.label }}
          }
          @if (props.required && props.hideRequiredMarker !== true) {
            <span aria-hidden="true">*</span>
          }
        </label>
      }
      <ng-container #fieldComponent></ng-container>

      @if (props.description) {
        <small class="block text-color-secondary">
          @if (props.allowHtml) {
            <span [innerHTML]="props.description"></span>
          } @else {
            <ng-container>{{ props.description }}</ng-container>
          }
        </small>
      }

      @if (showError) {
        <small class="p-error">
          <formly-validation-message class="ui-message-text" [field]="field"></formly-validation-message>
        </small>
      }
    </div>
  `,
  styles: ['.p-error { color: var(--p-red-500); }'],
  standalone: false,
})
export class FormlyWrapperFormField extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {}
