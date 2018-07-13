import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { FormlyNsFormFieldModule } from '@ngx-formly/nativescript/form-field';
import { FormlyNsTextFieldModule } from '@ngx-formly/nativescript/text-field';

@NgModule({
  imports: [
    FormlyNsFormFieldModule,
    FormlyNsTextFieldModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FormlyNativescriptModule {}
