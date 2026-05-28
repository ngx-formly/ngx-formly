import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { ReactiveFormsModule } from '@angular/forms';

import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FormlyFieldNativeSelect } from './native-select.type';
import { withFormlyFieldNativeSelect } from './native-select.config';

@NgModule({
  declarations: [FormlyFieldNativeSelect],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,

    FormlyMatFormFieldModule,
    FormlySelectModule,
    FormlyModule.forChild(withFormlyFieldNativeSelect()),
  ],
})
export class FormlyMatNativeSelectModule {}
