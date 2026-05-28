import { Routes } from '@angular/router';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyPrimeNG } from '@ngx-formly/primeng';
import { UIComponent } from './ui.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: UIComponent,
    providers: [provideFormlyCore(withFormlyPrimeNG())],
  },
];
