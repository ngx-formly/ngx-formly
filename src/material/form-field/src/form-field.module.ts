import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormlyWrapperFormField } from './form-field.wrapper';
import { StringOrTemplateComponent } from './string-or-template.component';

@NgModule({
  declarations: [FormlyWrapperFormField, StringOrTemplateComponent],
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
})
export class FormlyMatFormFieldModule { }
