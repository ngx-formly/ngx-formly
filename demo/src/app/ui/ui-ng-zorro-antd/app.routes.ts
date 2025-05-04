import { provideFormlyCore } from '@ngx-formly/core';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonExampleConfigs, debugFields } from '../common';

import { Routes } from '@angular/router';
import { withFormlyNgZorroAntd } from '@ngx-formly/ng-zorro-antd';
import { AppComponent } from './app.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    providers: [provideFormlyCore(withFormlyNgZorroAntd())],
    children: [
      {
        path: '',
        component: ExamplesRouterViewerComponent,
        data: {
          debugFields,
          type: 'ng-zorro-antd',
          examples: [...CommonExampleConfigs],
        },
      },
    ],
  },
];
