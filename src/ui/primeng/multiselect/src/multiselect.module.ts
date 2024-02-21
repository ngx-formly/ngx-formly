import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule as FormlyCoreSelectModule } from '@ngx-formly/core/select';

import { FormlyFormFieldModule } from '@ngx-formly/primeng/form-field';
import { FormlyFieldMultiSelect } from './multiselect.type';
import { MultiSelectModule } from 'primeng/multiselect';
@NgModule({
  declarations: [FormlyFieldMultiSelect],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule,
    FormlyFormFieldModule,
    FormlyCoreSelectModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'multiselect',
          component: FormlyFieldMultiSelect,
          wrappers: ['form-field'],
        },
        { name: 'enum', extends: 'select' },
      ],
    }),
  ],
})
export class FormlyMultiSelectModule {}
