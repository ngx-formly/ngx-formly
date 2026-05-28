import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonExampleConfigs, debugFields } from '../common';

import { Routes } from '@angular/router';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

export const appRoutes: Routes = [
  {
    path: '',
    component: ExamplesRouterViewerComponent,
    providers: [
      provideFormlyCore([
        ...withFormlyBootstrap(),
        {
          validationMessages: [{ name: 'required', message: 'This field is required' }],
        },
      ]),
    ],
    data: {
      debugFields,
      type: 'bootstrap',
      examples: [...CommonExampleConfigs],
    },
  },
];
