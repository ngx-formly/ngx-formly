import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '../core/core';
import { BOOTSTRAP_FORMLY_CONFIG, FIELD_TYPE_COMPONENTS } from './ui-bootstrap.config';
import { FormlyValidationMessage } from './formly.validation-message';
import { FormlyConfig } from '../core/services/formly.config';
import { TemplateDescription } from './run/description';
import { TemplateValidation } from './run/validation';

@NgModule({
  declarations: [...FIELD_TYPE_COMPONENTS, FormlyValidationMessage],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(BOOTSTRAP_FORMLY_CONFIG),
  ],
  providers: [TemplateDescription, TemplateValidation],
})
export class FormlyBootstrapModule {
  constructor(private formlyConfig: FormlyConfig, private description: TemplateDescription, private validation: TemplateValidation) {
    this.description.run(this.formlyConfig);
    this.validation.run(this.formlyConfig);
  }
}
