import { NgModule } from '@angular/core';

import { FormlyBootstrapFormFieldModule } from '@ngx-formly/bootstrap/form-field';
import { FormlyBootstrapInputModule } from '@ngx-formly/bootstrap/input';
import { FormlyBootstrapTextAreaModule } from '@ngx-formly/bootstrap/textarea';
import { FormlyBootstrapRadioModule } from '@ngx-formly/bootstrap/radio';
import { FormlyBootstrapCheckboxModule } from '@ngx-formly/bootstrap/checkbox';
import { FormlyBootstrapMultiCheckboxModule } from '@ngx-formly/bootstrap/multicheckbox';
import { FormlyBootstrapSelectModule } from '@ngx-formly/bootstrap/select';
import { FormlyBootstrapAddonsModule } from '@ngx-formly/bootstrap/addons';

@NgModule({
  imports: [
    FormlyBootstrapFormFieldModule,
    FormlyBootstrapInputModule,
    FormlyBootstrapTextAreaModule,
    FormlyBootstrapRadioModule,
    FormlyBootstrapCheckboxModule,
    FormlyBootstrapMultiCheckboxModule,
    FormlyBootstrapSelectModule,
    FormlyBootstrapAddonsModule,
  ],
})
export class FormlyBootstrapModule { }
