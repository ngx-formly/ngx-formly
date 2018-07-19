import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { IONIC_FORMLY_CONFIG, FIELD_TYPE_COMPONENTS } from './ui-ionic.config';

@NgModule({
  declarations: FIELD_TYPE_COMPONENTS,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormlySelectModule,
    FormlyModule.forRoot(IONIC_FORMLY_CONFIG),
  ],
})
export class FormlyIonicModule {
}
