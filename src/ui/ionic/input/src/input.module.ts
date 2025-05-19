import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormlyFormFieldModule } from '@ngx-formly/ionic/form-field';

import { FormlyFieldInput } from './input.type';
import { withFormlyFieldInput } from './input.config';

@NgModule({
  declarations: [FormlyFieldInput],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormlyFormFieldModule,
    FormlyModule.forChild(withFormlyFieldInput()),
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FormlyInputModule {}
