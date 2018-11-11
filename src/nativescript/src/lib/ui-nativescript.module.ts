import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { FormlyNsFormFieldModule } from '@ngx-formly/nativescript/form-field';
import { FormlyNsTextFieldModule } from '@ngx-formly/nativescript/text-field';
import { FormlyNsTextareaFieldModule } from '@ngx-formly/nativescript/textarea';
import { FormlyNsCheckboxFieldModule } from '@ngx-formly/nativescript/checkbox';

@NgModule({
  imports: [
    FormlyNsFormFieldModule,
    FormlyNsTextFieldModule,
    FormlyNsTextareaFieldModule,
    FormlyNsCheckboxFieldModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FormlyNativescriptModule {}
