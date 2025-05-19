import { Routes } from '@angular/router';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyNgZorroAntd } from '@ngx-formly/ng-zorro-antd';
import { UIComponent } from './ui.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: UIComponent,
    providers: [provideFormlyCore(withFormlyNgZorroAntd())],
  },
];
