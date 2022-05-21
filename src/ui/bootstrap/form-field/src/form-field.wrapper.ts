import { Component } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig, FormlyFieldProps as CoreFormlyFieldProps } from '@ngx-formly/core';

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideLabel?: boolean;
  hideRequiredMarker?: boolean;
}

@Component({
  selector: 'formly-wrapper-form-field',
  template: `
    <div class="mb-3" [class.has-error]="showError">
      <label *ngIf="props.label && props.hideLabel !== true" [attr.for]="id" class="form-label">
        {{ props.label }}
        <span *ngIf="props.required && props.hideRequiredMarker !== true" aria-hidden="true">*</span>
      </label>

      <ng-template #fieldComponent></ng-template>

      <div *ngIf="showError" class="invalid-feedback" [style.display]="'block'">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>

      <small *ngIf="props.description" class="form-text text-muted">{{ props.description }}</small>
    </div>
  `,
})
export class FormlyWrapperFormField extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {}
