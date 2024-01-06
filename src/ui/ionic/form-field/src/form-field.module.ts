import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonRadio, IonicModule } from '@ionic/angular';
import { FormlyWrapperFormField } from './form-field.wrapper';
import { IonFormlyAttributes } from './formly.attributes';

export function formFieldLegacyExtension(field: FormlyFieldConfig) {
  if (field.props?.hasOwnProperty('legacyLabel')) {
    return;
  }

  field.props = {
    legacyLabel: !IonRadio.prototype.hasOwnProperty('legacy'),
    ...(field.props || {}),
  };
}

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
      extensions: [{ name: 'form-field-legacy', extension: { postPopulate: formFieldLegacyExtension } }],
    }),
  ],
})
export class FormlyFormFieldModule {}
