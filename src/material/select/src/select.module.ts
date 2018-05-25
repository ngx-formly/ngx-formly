import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { FormlyFieldSelect } from './select.type';
import { FormlySelectOptionsPipe } from './select-options.pipe';

@NgModule({
  declarations: [FormlyFieldSelect, FormlySelectOptionsPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,

    FormlyMatFormFieldModule,
    FormlyModule.forChild({
      types: [{
        name: 'select',
        component: FormlyFieldSelect,
        wrappers: ['form-field'],
        defaultOptions: {
          templateOptions: {
            options: [],
          },
        },
      }],
    }),
  ],
})
export class FormlyMatSelectModule { }
