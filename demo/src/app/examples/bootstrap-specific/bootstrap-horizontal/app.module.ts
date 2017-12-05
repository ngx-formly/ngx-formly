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
      wrappers: [{ name: 'horizontalWrapper', component: FormlyHorizontalWrapper }],
      types: [{ name: 'horizontalInput', extends: 'input', wrappers: ['fieldset', 'horizontalWrapper'] }],
    }),
  ],
  declarations: [
    AppComponent,
    FormlyHorizontalWrapper,
  ],
})
export class AppModule { }
