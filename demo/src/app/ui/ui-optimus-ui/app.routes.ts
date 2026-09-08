import { ExamplesRouterViewerComponent } from '../../shared';
import { debugFields } from '../common';

import { AppComponent } from './app.component';
import { withFormlyOptimusUI } from '@ngx-formly/optimus-ui';
import { InputExampleConfig } from '../common/input';
import { CheckboxExampleConfig } from '../common/checkbox';
import { RadioExampleConfig } from '../common/radio';
import { TextareaExampleConfig } from '../common/textarea';
import { SelectAppConfig, SelectExampleConfig } from './select';
import { DatepickerAppConfig, DatepickerExampleConfig } from './datepicker';
import { Routes } from '@angular/router';
import { provideFormlyCore } from '@ngx-formly/core';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        component: ExamplesRouterViewerComponent,
        providers: [
          provideFormlyCore([...withFormlyOptimusUI()]),
          SelectAppConfig.providers,
          DatepickerAppConfig.providers,
        ],
        data: {
          debugFields,
          type: 'optimus-ui',
          examples: [
            InputExampleConfig,
            TextareaExampleConfig,
            CheckboxExampleConfig,
            RadioExampleConfig,
            SelectExampleConfig,
            DatepickerExampleConfig,
          ],
        },
      },
    ],
  },
];
