import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { IonicModule } from '@ionic/angular';
import { FormlySelectModule as FormlyCoreSelectModule } from '@ngx-formly/core/select';

import { FormlyFormFieldModule } from '@ngx-formly/ionic/form-field';
import { FormlyFieldSelect } from './select.type';
import { withFormlyFieldSelect } from './select.config';

@NgModule({
  declarations: [FormlyFieldSelect],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,

    FormlyFormFieldModule,
    FormlyCoreSelectModule,
    FormlyModule.forChild(withFormlyFieldSelect()),
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FormlySelectModule {}
