import { provideFormlyCore } from '@ngx-formly/core';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonExampleConfigs, debugFields } from '../common';

import { Routes } from '@angular/router';
import { withFormlyKendo } from '@ngx-formly/kendo';
import { AppComponent } from './app.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    providers: [provideFormlyCore(withFormlyKendo())],
    children: [
      {
        path: '',
        component: ExamplesRouterViewerComponent,
        data: {
          debugFields,
          type: 'kendo',
          examples: [...CommonExampleConfigs],
        },
      },
    ],
  },
];
