import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { NgFormlyConfig, FORMLY_COMPONENTS } from './formly';
import { SuperHerosService } from './services';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    FORMLY_COMPONENTS,
  ],
  providers: [SuperHerosService],
  imports: [
    BrowserModule,
    FormlyModule.forRoot(NgFormlyConfig),
    FormlyBootstrapModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
