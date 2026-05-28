import { Routes } from '@angular/router';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyKendo } from '@ngx-formly/kendo';
import { UIComponent } from './ui.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: UIComponent,
    providers: [provideFormlyCore(withFormlyKendo())],
  },
];
