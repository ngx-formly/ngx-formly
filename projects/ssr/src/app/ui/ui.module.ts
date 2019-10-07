import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { UIComponent } from './ui.component';

@NgModule({
  declarations: [
    UIComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormlyModule.forRoot({}),
  ],
  exports: [
    UIComponent,
    ReactiveFormsModule,
    FormlyModule,
  ],
})
export class UIModule { }