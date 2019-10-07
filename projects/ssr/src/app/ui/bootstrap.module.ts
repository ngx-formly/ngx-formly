import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { UIModule } from './ui.module';
import { UIComponent } from './ui.component';

@NgModule({
  imports: [
    UIModule,
    FormlyBootstrapModule,
    RouterModule.forChild([{
      path: '',
      component: UIComponent,
    }]),
  ],
  providers: [],
})
export class UIBootstrapModule { }