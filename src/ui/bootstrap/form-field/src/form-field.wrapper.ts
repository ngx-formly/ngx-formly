import { Component } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig, FormlyFieldProps as CoreFormlyFieldProps } from '@ngx-formly/core';

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideLabel?: boolean;
  hideRequiredMarker?: boolean;
  labelPosition?: 'floating';
}

@Component({
  selector: 'formly-wrapper-form-field',
  template: `
    <ng-template #labelTemplate>
      @if (props.label && props.hideLabel !== true) {
        <label [attr.for]="id" class="form-label">
          {{ props.label }}
          @if (props.required && props.hideRequiredMarker !== true) {
            <span aria-hidden="true">*</span>
          }
        </label>
      }
    </ng-template>

    <div [class.form-floating]="props.labelPosition === 'floating'" [class.has-error]="showError">
      @if (props.labelPosition !== 'floating') {
        <ng-container [ngTemplateOutlet]="labelTemplate"></ng-container>
      }

      <ng-template #fieldComponent></ng-template>

      @if (props.labelPosition === 'floating') {
        <ng-container [ngTemplateOutlet]="labelTemplate"></ng-container>
      }

      @if (showError) {
        <div class="invalid-feedback" [style.display]="'block'">
          <formly-validation-message
            id="{{ id }}-formly-validation-error"
            [field]="field"
            role="alert"
          ></formly-validation-message>
        </div>
      }

      @if (props.description) {
        <small class="form-text text-muted">{{ props.description }}</small>
      }
    </div>
  `,
  styleUrls: ['./form-field.wrapper.scss'],
  standalone: false,
})
export class FormlyWrapperFormField extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {}
