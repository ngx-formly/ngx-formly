import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { ReactiveFormsModule } from '@angular/forms';

import { FormlyMatFormFieldModule } from '@ngx-formly/material-legacy/form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

import { FormlyFieldNativeSelect } from './native-select.type';

@NgModule({
  declarations: [FormlyFieldNativeSelect],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,

    FormlyMatFormFieldModule,
    FormlySelectModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'native-select',
          component: FormlyFieldNativeSelect,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class FormlyMatNativeSelectModule {}
