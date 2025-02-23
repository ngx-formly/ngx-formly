import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyDatepickerModule } from '@ngx-formly/primeng/datepicker';

import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      validationMessages: [{ name: 'required', message: 'This field is required' }],
    }),

    FormlyDatepickerModule,
  ],
  declarations: [AppComponent],
  providers: [provideAnimationsAsync(), providePrimeNG({ theme: { preset: Aura } })],
})
export class AppModule {}
