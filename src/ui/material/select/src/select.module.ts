import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';

import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { FormlyFieldSelect } from './select.type';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { withFormlyFieldSelect } from './select.config';

@NgModule({
  declarations: [FormlyFieldSelect],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatPseudoCheckboxModule,

    FormlyMatFormFieldModule,
    FormlySelectModule,
    FormlyModule.forChild(withFormlyFieldSelect()),
  ],
})
export class FormlyMatSelectModule {}
