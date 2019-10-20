import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ValidationErrors } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { AppComponent } from './app.component';

export function IpValidator(control: FormControl): ValidationErrors {
  return !control.value || /(\d{1,3}\.){3}\d{1,3}/.test(control.value) ? null : { ip: true };
}

export function IpValidatorMessage(err, field: FormlyFieldConfig) {
  return `"${field.formControl.value}" is not a valid IP Address`;
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      validators: [{ name: 'ip', validation: IpValidator }],
      validationMessages: [{ name: 'ip', message: IpValidatorMessage }],
    }),
  ],
  declarations: [AppComponent],
})
export class AppModule {}
