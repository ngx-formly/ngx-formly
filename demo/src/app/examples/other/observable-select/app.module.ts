import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { AppComponent } from './app.component';
import { DataService } from './data.service';
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapModule, FormlyModule.forRoot()],
  declarations: [AppComponent],
  providers: [DataService],
})
export class AppModule {}
