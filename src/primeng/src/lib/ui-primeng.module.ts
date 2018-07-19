import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';

import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { PRIME_NG_FORMLY_CONFIG, FIELD_TYPE_COMPONENTS } from './ui-primeng.config';

@NgModule({
  declarations: FIELD_TYPE_COMPONENTS,
  imports: [
    CommonModule,

    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    RadioButtonModule,
    DropdownModule,

    ReactiveFormsModule,
    FormlySelectModule,
    FormlyModule.forRoot(PRIME_NG_FORMLY_CONFIG),
  ],
})
export class FormlyPrimeNGModule {}
