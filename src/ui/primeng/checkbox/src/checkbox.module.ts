import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FormlyFormFieldModule } from '@ngx-formly/primeng/form-field';

import { FormlyFieldCheckbox } from './checkbox.type';
import { withFormlyFieldCheckbox } from './checkbox.config';

@NgModule({
  declarations: [FormlyFieldCheckbox],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxModule,
    FormlyFormFieldModule,
    FormlyModule.forChild(withFormlyFieldCheckbox()),
  ],
})
export class FormlyCheckboxModule {}
