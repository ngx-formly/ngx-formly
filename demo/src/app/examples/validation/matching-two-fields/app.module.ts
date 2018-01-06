import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

export function minlengthValidationMessages(err, field) {
  return `Should have atleast ${field.templateOptions.minLength} characters`;
}

import { AppComponent } from './app.component';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' },
        { name: 'minlength', message: minlengthValidationMessages },
      ],
    }),
  ],
  declarations: [
    AppComponent,
  ],
})
export class AppModule { }
