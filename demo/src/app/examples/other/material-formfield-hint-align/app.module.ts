import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

import { AppComponent } from './app.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormlyMaterialModule, FormlyModule.forRoot()],
  declarations: [AppComponent],
})
export class AppModule {}
