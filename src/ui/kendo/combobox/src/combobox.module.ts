import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormlySelectModule as FormlyCoreSelectModule } from '@ngx-formly/core/select';

import { FormlyFieldComboBox } from './combobox.type';

import { FormlyFormFieldModule } from '@ngx-formly/kendo/form-field';



@NgModule({
  declarations: [FormlyFieldComboBox],
  imports: [

    CommonModule,
    ReactiveFormsModule,
    DropDownsModule,
    FormlyFormFieldModule,
    FormlyCoreSelectModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'combobox',
          component: FormlyFieldComboBox,
          wrappers: ['form-field'],
        },
        { name: 'enum', extends: 'select' },
      ],
    }),
  ],
})
export class FormlyComboBoxModule {}
