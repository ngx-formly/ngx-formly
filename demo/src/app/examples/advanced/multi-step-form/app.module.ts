import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { MatStepperModule } from '@angular/material/stepper';

import { AppComponent } from './app.component';
import { FormlyFieldStepper } from './stepper.type';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' },
      ],
      types: [
        { name: 'stepper', component: FormlyFieldStepper, wrappers: [] },
      ],
    }),
  ],
  declarations: [
    AppComponent,
    FormlyFieldStepper,
  ],
})
export class AppModule { }
