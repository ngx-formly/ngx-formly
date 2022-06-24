import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NbRadioModule } from '@nebular/theme';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { FormlyFieldRadio } from './radio.type';
import { FormlyNebularFormFieldModule } from '@ngx-formly/nebular/form-field';

@NgModule({
  declarations: [FormlyFieldRadio],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormlySelectModule,
    NbRadioModule,
    FormlyNebularFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'radio',
          component: FormlyFieldRadio,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class FormlyNebularRadioModule {}
