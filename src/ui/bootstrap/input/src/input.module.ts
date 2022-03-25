import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormlyBootstrapFormFieldModule } from '@ngx-formly/bootstrap/form-field';

import { FormlyFieldInput } from './input.type';

@NgModule({
  declarations: [FormlyFieldInput],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormlyBootstrapFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'input',
          component: FormlyFieldInput,
          wrappers: ['form-field'],
        },
        { name: 'string', extends: 'input' },
        {
          name: 'number',
          extends: 'input',
          defaultOptions: {
            props: {
              type: 'number',
            },
          },
        },
        {
          name: 'integer',
          extends: 'input',
          defaultOptions: {
            props: {
              type: 'number',
            },
          },
        },
      ],
    }),
  ],
})
export class FormlyBootstrapInputModule {}
