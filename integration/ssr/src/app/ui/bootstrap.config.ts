import { Routes } from '@angular/router';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';
import { UIComponent } from './ui.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: UIComponent,
    providers: [provideFormlyCore(withFormlyBootstrap())],
  },
];
