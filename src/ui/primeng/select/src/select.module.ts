import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { SelectModule } from 'primeng/select';
import { FormlySelectModule as FormlyCoreSelectModule } from '@ngx-formly/core/select';

import { FormlyFormFieldModule } from '@ngx-formly/primeng/form-field';
import { FormlyFieldSelect } from './select.type';

@NgModule({
  declarations: [FormlyFieldSelect],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    FormlyFormFieldModule,
    FormlyCoreSelectModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'select',
          component: FormlyFieldSelect,
          wrappers: ['form-field'],
        },
        { name: 'enum', extends: 'select' },
      ],
    }),
  ],
})
export class FormlySelectModule {}
