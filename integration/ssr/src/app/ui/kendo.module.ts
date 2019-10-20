import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormlyKendoModule } from '@ngx-formly/kendo';

import { UIModule } from './ui.module';
import { UIComponent } from './ui.component';

@NgModule({
  imports: [
    UIModule,
    FormlyKendoModule,
    RouterModule.forChild([
      {
        path: '',
        component: UIComponent,
      },
    ]),
  ],
  providers: [],
})
export class UIKendoModule {}
