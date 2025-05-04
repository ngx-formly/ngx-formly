import { provideFormlyCore } from '@ngx-formly/core';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonExampleConfigs, debugFields } from '../common';

import { Routes } from '@angular/router';
import { withFormlyMaterial } from '@ngx-formly/material';
import { NativeSelectAppConfig, NativeSelectExampleConfig } from './native-select';
import { DatepickerAppConfig, DatepickerExampleConfig } from './datepicker';
import { ToggleAppConfig, ToggleExampleConfig } from './toggle';
import { SliderAppConfig, SliderExampleConfig } from './slider';
import { AutocompleteAppConfig, AutocompleteExampleConfig } from './autocomplete';

export const appRoutes: Routes = [
  {
    path: '',
    component: ExamplesRouterViewerComponent,
    providers: [
      provideFormlyCore(withFormlyMaterial()),
      NativeSelectAppConfig.providers,
      DatepickerAppConfig.providers,
      ToggleAppConfig.providers,
      SliderAppConfig.providers,
      AutocompleteAppConfig.providers,
    ],
    data: {
      debugFields,
      type: 'material',
      examples: [
        ...CommonExampleConfigs,
        NativeSelectExampleConfig,
        DatepickerExampleConfig,
        ToggleExampleConfig,
        SliderExampleConfig,
        AutocompleteExampleConfig,
      ],
    },
  },
];
