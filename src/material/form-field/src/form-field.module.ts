import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormlyWrapperFormField } from './form-field.wrapper';
import { FormlyMatAttributes } from './formly.attributes';

@NgModule({
  declarations: [FormlyWrapperFormField, FormlyMatAttributes],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormlyModule.forChild({
      wrappers: [{
        name: 'form-field',
        component: FormlyWrapperFormField,
      }],
    }),
  ],
  exports: [FormlyMatAttributes],
})
export class FormlyMatFormFieldModule { }
