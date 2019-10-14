import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';

import { UIModule } from './ui.module';
import { UIComponent } from './ui.component';

@NgModule({
  imports: [
    UIModule,
    FormlyPrimeNGModule,
    RouterModule.forChild([{
      path: '',
      component: UIComponent,
    }]),
  ],
  providers: [],
})
export class UIPrimengModule { }
