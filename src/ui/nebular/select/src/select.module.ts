import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NbSelectModule } from '@nebular/theme';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyFieldSelect } from './select.type';
import { FormlyNebularFormFieldModule } from '@ngx-formly/nebular/form-field';
import { FormlySelectModule } from '@ngx-formly/core/select';

@NgModule({
  declarations: [FormlyFieldSelect],
  imports: [
    CommonModule,
    NbSelectModule,
    ReactiveFormsModule,
    FormlyNebularFormFieldModule,
    FormlySelectModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'select',
          component: FormlyFieldSelect,
          wrappers: ['form-field'],
        },
        {
          name: 'enum',
          extends: 'select',
        },
      ],
    }),
  ],
})
export class FormlyNebularSelectModule {}
