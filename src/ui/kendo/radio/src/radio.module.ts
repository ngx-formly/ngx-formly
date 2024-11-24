import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { FormlyFormFieldModule } from '@ngx-formly/kendo/form-field';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormlyFieldRadio } from './radio.type';
import { withFormlyFieldRadio } from './radio.config';

@NgModule({
  declarations: [FormlyFieldRadio],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    LabelModule,
    InputsModule,
    FormlyFormFieldModule,
    FormlySelectModule,
    FormlyModule.forChild(withFormlyFieldRadio()),
  ],
})
export class FormlyRadioModule {}
