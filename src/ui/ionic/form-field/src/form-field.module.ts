import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormlyWrapperFormField } from './form-field.wrapper';
import { IonFormlyAttributes } from './formly.attributes';

@NgModule({
  declarations: [FormlyWrapperFormField, IonFormlyAttributes],
  exports: [IonFormlyAttributes],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,

    FormlyModule.forChild({
      wrappers: [
        {
          name: 'form-field',
          component: FormlyWrapperFormField,
        },
      ],
    }),
  ],
})
export class FormlyFormFieldModule {}
