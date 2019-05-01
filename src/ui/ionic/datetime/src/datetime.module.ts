import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormlyFormFieldModule } from '@ngx-formly/ionic/form-field';

import { FormlyFieldDatetime } from './datetime.type';

@NgModule({
  declarations: [FormlyFieldDatetime],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormlyFormFieldModule,
    FormlyModule.forChild({
      types: [{
        name: 'datetime',
        component: FormlyFieldDatetime,
        wrappers: ['form-field'],
      }],
    }),
  ],
})
export class FormlyDatetimeModule { }
