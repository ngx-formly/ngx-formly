import { NgModule } from '@angular/core';
import { FormlyNebularInputModule } from '@ngx-formly/nebular/input';
import { FormlyNebularFormFieldModule } from '@ngx-formly/nebular/form-field';
import { FormlyNebularTextareaModule } from '@ngx-formly/nebular/textarea';
import { FormlyNebularRadioModule } from '@ngx-formly/nebular/radio';
import { FormlyNebularSelectModule } from '@ngx-formly/nebular/select';
import { FormlyNebularCheckboxModule } from '@ngx-formly/nebular/checkbox';

@NgModule({
  imports: [
    FormlyNebularInputModule,
    FormlyNebularFormFieldModule,
    FormlyNebularTextareaModule,
    FormlyNebularRadioModule,
    FormlyNebularSelectModule,
    FormlyNebularCheckboxModule,
  ],
})
export class FormlyNebularModule {}
