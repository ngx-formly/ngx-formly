import { NgModule, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '../../core';
import { BOOTSTRAP_FORMLY_CONFIG, FIELD_TYPE_COMPONENTS } from './ui-bootstrap.config';
import { FormlyValidationMessage } from './formly.validation-message';

@NgModule({
  declarations: [...FIELD_TYPE_COMPONENTS, FormlyValidationMessage],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(BOOTSTRAP_FORMLY_CONFIG),
  ],
})
export class FormlyBootstrapModule {
  constructor() {
    if (isDevMode()) {
      console.warn(`'ng-formy' is deprecated, use '@ngx-formly/bootstrap' instead`);
    }
  }
}
