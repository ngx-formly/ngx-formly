import { provideFormlyCore } from '@ngx-formly/core';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonExampleConfigs, debugFields } from '../common';

import { Routes } from '@angular/router';
import { DatetimeAppConfig, DatetimeExampleConfig } from './datetime';
import { RangeAppConfig, RangeExampleConfig } from './range';
import { ToggleAppConfig, ToggleExampleConfig } from './toggle';
import { withFormlyIonic } from '@ngx-formly/ionic';

export const appRoutes: Routes = [
  {
    path: '',
    component: ExamplesRouterViewerComponent,
    providers: [
      provideFormlyCore([...withFormlyIonic()]),
      DatetimeAppConfig.providers,
      RangeAppConfig.providers,
      ToggleAppConfig.providers,
    ],
    data: {
      debugFields,
      type: 'ionic',
      examples: [...CommonExampleConfigs, DatetimeExampleConfig, RangeExampleConfig, ToggleExampleConfig],
    },
  },
];
