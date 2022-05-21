import { Component, ViewChild, OnInit } from '@angular/core';
import { FormFieldComponent, Orientation } from '@progress/kendo-angular-inputs';
import {
  ɵdefineHiddenProp as defineHiddenProp,
  FieldWrapper,
  FormlyFieldConfig,
  FormlyFieldProps as CoreFormlyFieldProps,
} from '@ngx-formly/core';

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideRequiredMarker?: boolean;
  hideLabel?: boolean;
  orientation?: Orientation;
}

@Component({
  selector: 'formly-wrapper-kendo-form-field',
  template: `
    <kendo-formfield [orientation]="props.orientation">
      <label *ngIf="props.label && props.hideLabel !== true" [for]="id">
        {{ props.label }}
        <span *ngIf="props.required && props.hideRequiredMarker !== true" aria-hidden="true" class="k-required">*</span>
      </label>

      <ng-container #fieldComponent></ng-container>

      <kendo-formhint *ngIf="props.description">{{ props.description }}</kendo-formhint>
      <kendo-formerror *ngIf="showError">
        <formly-validation-message [field]="field"></formly-validation-message>
      </kendo-formerror>
    </kendo-formfield>
  `,
})
export class FormlyWrapperFormField extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> implements OnInit {
  @ViewChild(FormFieldComponent, { static: true }) formfield!: FormFieldComponent;

  ngOnInit() {
    defineHiddenProp(this.field, '_formField', this.formfield);
    defineHiddenProp(this.formfield, 'formControls', undefined);
    this.formfield['showErrorsInitial'] = () => this.showError;
    this.formfield['showHintsInitial'] = () => !this.showError;

    const disabledElement = this.formfield['disabledElement'].bind(this);
    this.formfield['disabledElement'] = () => {
      if (this.formfield.controlElementRefs.length === 0) {
        return false;
      }

      return disabledElement();
    };
  }
}
