import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { AppComponent } from './app.component';
import { FormlyHorizontalWrapper } from './horizontal-wrapper';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      wrappers: [{ name: 'form-field-horizontal', component: FormlyHorizontalWrapper }],
      validationMessages: [
        { name: 'required', message: 'This field is required' },
      ],
    }),
  ],
  declarations: [
    AppComponent,
    FormlyHorizontalWrapper,
  ],
})
export class AppModule { }
