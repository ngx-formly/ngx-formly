import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ValidationErrors } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { AppComponent } from './app.component';

export function dateFutureValidator(control: FormControl, field: FormlyFieldConfig, options = {}): ValidationErrors {
  return { 'date-future': { message: `Validator options: ${JSON.stringify(options)}` } };
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      validators: [
        {
          name: 'date-future',
          validation: dateFutureValidator,
          options: { days: 2 },
        },
      ],
    }),
  ],
  declarations: [
    AppComponent,
  ],
})
export class AppModule { }
