import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { BOOTSTRAP_FORMLY_CONFIG, FIELD_TYPE_COMPONENTS } from './bootstrap.config';
import { FormlySelectOptionsPipe } from './select-options.pipe';

@NgModule({
  declarations: [
    FIELD_TYPE_COMPONENTS,
    FormlySelectOptionsPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(BOOTSTRAP_FORMLY_CONFIG),
  ],
})
export class FormlyBootstrapModule {
}
