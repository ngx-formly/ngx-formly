import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MATERIAL_FORMLY_CONFIG, FIELD_TYPE_COMPONENTS } from './ui-material.config';
import { FormlyValidationMessage } from './formly.validation-message';

@NgModule({
  declarations: [...FIELD_TYPE_COMPONENTS, FormlyValidationMessage],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    FormlyModule.forRoot(MATERIAL_FORMLY_CONFIG),
  ],
})
export class FormlyMaterialModule {}
