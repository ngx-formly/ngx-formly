import { NgModule } from '@angular/core';
import { FormlyFormFieldModule } from '@ngx-formly/kendo/form-field';
import { FormlyInputModule } from '@ngx-formly/kendo/input';
import { FormlyTextAreaModule } from '@ngx-formly/kendo/textarea';
import { FormlyRadioModule } from '@ngx-formly/kendo/radio';
import { FormlyCheckboxModule } from '@ngx-formly/kendo/checkbox';
import { FormlySelectModule } from '@ngx-formly/kendo/select';

@NgModule({
  imports: [
    FormlyFormFieldModule,
    FormlyInputModule,
    FormlyTextAreaModule,
    FormlyRadioModule,
    FormlyCheckboxModule,
    FormlySelectModule,
  ],
})
export class FormlyKendoModule {}
