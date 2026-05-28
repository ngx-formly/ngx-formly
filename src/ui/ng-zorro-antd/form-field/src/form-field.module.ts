import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormlyWrapperFormField } from './form-field.wrapper';
import { withFormlyFormField } from './form-field.config';

@NgModule({
  declarations: [FormlyWrapperFormField],
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, FormlyModule.forChild(withFormlyFormField())],
})
export class FormlyNzFormFieldModule {}
