import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormlyNgZorroAntdModule } from '@ngx-formly/ng-zorro-antd';

import { UIModule } from './ui.module';
import { UIComponent } from './ui.component';

@NgModule({
  imports: [
    UIModule,
    FormlyNgZorroAntdModule,
    RouterModule.forChild([
      {
        path: '',
        component: UIComponent,
      },
    ]),
  ],
  providers: [],
})
export class UIAntdModule {}
