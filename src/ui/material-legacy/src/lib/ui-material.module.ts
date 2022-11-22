import { NgModule } from '@angular/core';

import { FormlyMatFormFieldModule } from '@ngx-formly/material-legacy/form-field';
import { FormlyMatInputModule } from '@ngx-formly/material-legacy/input';
import { FormlyMatTextAreaModule } from '@ngx-formly/material-legacy/textarea';
import { FormlyMatRadioModule } from '@ngx-formly/material-legacy/radio';
import { FormlyMatCheckboxModule } from '@ngx-formly/material-legacy/checkbox';
import { FormlyMatMultiCheckboxModule } from '@ngx-formly/material-legacy/multicheckbox';
import { FormlyMatSelectModule } from '@ngx-formly/material-legacy/select';

@NgModule({
  imports: [
    FormlyMatFormFieldModule,
    FormlyMatInputModule,
    FormlyMatTextAreaModule,
    FormlyMatRadioModule,
    FormlyMatCheckboxModule,
    FormlyMatMultiCheckboxModule,
    FormlyMatSelectModule,
  ],
})
export class FormlyMaterialModule {}
