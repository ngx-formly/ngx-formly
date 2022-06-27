import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { NbCheckboxModule } from '@nebular/theme';
import { FormlyFieldCheckbox } from './checkbox.type';
import { FormlyNebularFormFieldModule } from '@ngx-formly/nebular/form-field';

@NgModule({
  declarations: [FormlyFieldCheckbox],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCheckboxModule,
    FormlyNebularFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'checkbox',
          component: FormlyFieldCheckbox,
          wrappers: ['form-field'],
        },
        {
          name: 'boolean',
          extends: 'checkbox',
        },
      ],
    }),
  ],
})
export class FormlyNebularCheckboxModule {}
