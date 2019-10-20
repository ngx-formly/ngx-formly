import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormlyWrapperAddons } from './addons.component';
import { addonsExtension } from './addon.extension';

@NgModule({
  declarations: [FormlyWrapperAddons],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormlyModule.forChild({
      wrappers: [{ name: 'addons', component: FormlyWrapperAddons }],
      extensions: [{ name: 'addons', extension: { postPopulate: addonsExtension } }],
    }),
  ],
})
export class FormlyBootstrapAddonsModule {}
