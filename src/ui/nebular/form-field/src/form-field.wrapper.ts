import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig, FormlyFieldProps as CoreFormlyFieldProps } from '@ngx-formly/core';

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideLabel?: boolean;
  hideRequiredMarker?: boolean;
}

@Component({
  selector: 'formly-wrapper-form-field',
  template: `
    <div class="form-group">
      <label *ngIf="props.label && props.hideLabel !== true" [attr.for]="id">
        {{ props.label }}
        <span *ngIf="props.required && props.hideRequiredMarker !== true" [style.color]="'red'">*</span>
      </label>
      <ng-template #fieldComponent></ng-template>
      <div *ngIf="showError" class="invalid-feedback" [style.display]="'block'">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
      <small *ngIf="props.description" class="form-text text-muted">{{ to.description }}</small>
    </div>
  `,
  styles: [
    `
      .form-group {
        display: flex;
        flex-flow: column wrap;
        margin-bottom: 20px;
      }
      .required {
        color: red;
      }
      .invalid-feedback {
        color: red;
        font-size: 0.7rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyWrapperFormField extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {}
