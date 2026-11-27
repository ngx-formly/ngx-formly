import { Component } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig, FormlyFieldProps as CoreFormlyFieldProps } from '@ngx-formly/core';

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideRequiredMarker?: boolean;
  hideLabel?: boolean;
}

@Component({
  selector: 'formly-wrapper-optimus-ui-form-field',
  template: `
    <div class="p-field field">
      @if (props.label && props.hideLabel !== true) {
        <label [id]="id + '-label'" [for]="id">
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
        <small>
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
  styles: [
    `
      .field {
        margin-block-end: 1rem;
      }
      .field > label {
        display: block;
        margin-block-end: 0.5rem;
      }
      small {
        display: block;
        margin-block-start: 0.25rem;
        color: var(--p-text-muted-color);
      }
      .p-error {
        color: var(--p-form-field-invalid-placeholder-color);
      }
    `,
  ],
  standalone: false,
})
export class FormlyWrapperFormField extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {}
