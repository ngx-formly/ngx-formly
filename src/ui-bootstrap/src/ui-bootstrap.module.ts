import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { BOOTSTRAP_FORMLY_CONFIG, FIELD_TYPE_COMPONENTS } from './ui-bootstrap.config';

@NgModule({
  declarations: FIELD_TYPE_COMPONENTS,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(BOOTSTRAP_FORMLY_CONFIG),
  ],
})
export class FormlyBootstrapModule {
}
