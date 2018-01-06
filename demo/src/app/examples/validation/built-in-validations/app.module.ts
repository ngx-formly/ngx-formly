import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { AppComponent } from './app.component';

export function minlengthValidationMessages(err, field) {
  return `Should have atleast ${field.templateOptions.minLength} characters`;
}

export function maxlengthValidationMessages(err, field) {
  return `This value should be less than ${field.templateOptions.maxLength} characters`;
}

export function minValidationMessages(err, field) {
  return `This value should be more than ${field.templateOptions.min}`;
}

export function maxValidationMessages(err, field) {
  return `This value should be less than ${field.templateOptions.max}`;
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' },
        { name: 'minlength', message: minlengthValidationMessages },
        { name: 'maxlength', message: maxlengthValidationMessages },
        { name: 'min', message: minValidationMessages },
        { name: 'max', message: maxValidationMessages },
      ],
    }),
  ],
  declarations: [
    AppComponent,
  ],
})
export class AppModule { }
