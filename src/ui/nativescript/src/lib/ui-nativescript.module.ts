import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { FormlyNsFormFieldModule } from '@ngx-formly/nativescript/form-field';
import { FormlyNsTextFieldModule } from '@ngx-formly/nativescript/text-field';
import { FormlyNsTextareaFieldModule } from '@ngx-formly/nativescript/textarea';
import { FormlyNsCheckboxFieldModule } from '@ngx-formly/nativescript/checkbox';
import { FormlyNsRadioFieldModule } from '@ngx-formly/nativescript/radio';
import { FormlyNsSelectFieldModule } from '@ngx-formly/nativescript/select';

@NgModule({
  imports: [
    FormlyNsFormFieldModule,
    FormlyNsTextFieldModule,
    FormlyNsTextareaFieldModule,
    FormlyNsCheckboxFieldModule,
    FormlyNsRadioFieldModule,
    FormlyNsSelectFieldModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FormlyNativescriptModule {}
