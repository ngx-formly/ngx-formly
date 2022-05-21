import { Component } from '@angular/core';
import { IonItem, IonLabel } from '@ionic/angular';
import { FieldWrapper, FormlyFieldConfig, FormlyFieldProps as CoreFormlyFieldProps } from '@ngx-formly/core';

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideRequiredMarker?: boolean;
  itemLines?: IonItem['lines'];
  labelPosition?: IonLabel['position'];
}

@Component({
  selector: 'formly-wrapper-ion-form-field',
  template: `
    <ion-item [lines]="props.itemLines">
      <ion-label [position]="props.labelPosition">
        {{ props.label }}
        <span *ngIf="props.required && props.hideRequiredMarker !== true" aria-hidden="true">*</span>
      </ion-label>
      <ng-template #fieldComponent></ng-template>
    </ion-item>
    <ion-item lines="none" *ngIf="showError">
      <ion-label>
        <ion-text color="danger">
          <p>
            <formly-validation-message [field]="field"></formly-validation-message>
          </p>
        </ion-text>
      </ion-label>
    </ion-item>
  `,
})
export class FormlyWrapperFormField extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {}
