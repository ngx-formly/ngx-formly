import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { AppComponent } from './app.component';
import { FormlyFieldInputAdjusted } from './form-field-adjusted.wrapper';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      types: [
        {
          name: 'input-adjusted',
          component: FormlyFieldInputAdjusted,
        },
      ],
    }),
  ],
  declarations: [AppComponent, FormlyFieldInputAdjusted],
})
export class AppModule {}
