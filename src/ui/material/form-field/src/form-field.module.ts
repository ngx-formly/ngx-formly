import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormlyWrapperFormField } from './form-field.wrapper';
import { withFormlyFormField } from './form-field.config';

@NgModule({
  declarations: [FormlyWrapperFormField],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, FormlyModule.forChild(withFormlyFormField())],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FormlyMatFormFieldModule {}
