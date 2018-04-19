import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { FormlyModule } from '@ngx-formly/core';
import { PRIME_NG_FORMLY_CONFIG, FIELD_TYPE_COMPONENTS } from './ui-kendo.config';

@NgModule({
  declarations: FIELD_TYPE_COMPONENTS,
  imports: [
    CommonModule,
    DropDownsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(PRIME_NG_FORMLY_CONFIG),
  ],
})
export class FormlyKendoModule {}
