import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyFieldInput } from '@ngx-formly/bootstrap/input';
import { withFormlyFormField } from '@ngx-formly/bootstrap/form-field';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    providers: [
      provideFormlyCore([
        withFormlyFormField(),
        withFormlyFieldInput(),
        { validationMessages: [{ name: 'required', message: 'Please enter your name.' }] },
      ]),
    ],
  },
  {
    path: 'docs',
    children: [
      {
        path: '**',
        redirectTo: ({ url, queryParams, fragment }) =>
          inject(Router).createUrlTree(['/', ...url.map((segment) => segment.path).filter(Boolean)], {
            queryParams,
            fragment,
          }),
      },
    ],
  },
  { path: 'guide', loadChildren: () => import('./guides/guides.routes').then((m) => m.guidesRoutes) },
  { path: 'ui', loadChildren: () => import('./ui/ui.routes').then((m) => m.uiRoutes) },
  { path: 'examples', loadChildren: () => import('./examples/examples.routes').then((m) => m.examplesRoutes) },
  { path: 'api', loadChildren: () => import('./api/api.routes').then((m) => m.apiRoutes) },
];
