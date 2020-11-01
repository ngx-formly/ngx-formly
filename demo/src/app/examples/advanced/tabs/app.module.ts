import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { MatTabsModule } from '@angular/material/tabs';

import { AppComponent } from './app.component';
import { FormlyFieldTabs } from './tabs.type';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      validationMessages: [{ name: 'required', message: 'This field is required' }],
      types: [{ name: 'tabs', component: FormlyFieldTabs }],
    }),
  ],
  declarations: [AppComponent, FormlyFieldTabs],
})
export class AppModule {}
