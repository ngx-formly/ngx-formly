import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormlySelectModule as FormlyCoreSelectModule } from '@ngx-formly/core/select';

import { FormlyFormFieldModule } from '@ngx-formly/kendo/form-field';
import { FormlyFieldSelect } from './select.type';

@NgModule({
  declarations: [FormlyFieldSelect],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropDownsModule,

    FormlyFormFieldModule,
    FormlyCoreSelectModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'select',
          component: FormlyFieldSelect,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class FormlySelectModule {}
