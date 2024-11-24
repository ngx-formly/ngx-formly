import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyWrapperAddons } from './addons.component';
import { withFormlyWrapperAddons } from './addons.config';

@NgModule({
  declarations: [FormlyWrapperAddons],
  imports: [CommonModule, ReactiveFormsModule, FormlyModule.forChild(withFormlyWrapperAddons())],
})
export class FormlyBootstrapAddonsModule {}
