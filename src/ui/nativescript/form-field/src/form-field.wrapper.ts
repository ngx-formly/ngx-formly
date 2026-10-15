import { Component } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig, FormlyFieldProps as CoreFormlyFieldProps } from '@ngx-formly/core';

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideLabel?: boolean;
}

@Component({
  selector: 'formly-wrapper-ns-form-field',
  template: `
    <StackLayout class="form">
      <StackLayout class="input-field">
        @if (props.label && props.hideLabel !== true) {
          <Label class="label" [text]="props.label"></Label>
        }
        <ng-container #fieldComponent></ng-container>
        <StackLayout class="hr-light"></StackLayout>
        @if (showError) {
          <!-- NativeScript labels handle line breaks; its CSS parser does not support pre-line. -->
          <formly-validation-message
            #validationMessage
            [field]="field"
            style="white-space: normal"
          ></formly-validation-message>
          @if (field.validation?.showAllErrors) {
            <Label class="text-danger" [text]="validationMessage.errorMessage$ | async" [textWrap]="true"></Label>
          } @else {
            <Label class="text-danger" [text]="validationMessage.errorMessage"></Label>
          }
        }
      </StackLayout>
    </StackLayout>
  `,
  standalone: false,
})
export class FormlyWrapperFormField extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {}
