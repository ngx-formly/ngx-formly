import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormlySelectModule as FormlyCoreSelectModule } from '@ngx-formly/core/select';

import { FormlyFieldMultiSelect } from './multiselect.type';
import { FormlyFormFieldModule } from '@ngx-formly/kendo/form-field';

@NgModule({
  declarations: [FormlyFieldMultiSelect],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropDownsModule,
    FormlyFormFieldModule,
    FormlyCoreSelectModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'multiselect',
          component: FormlyFieldMultiSelect,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class FormlyMultiSelectModule {}
