import { inject, provideEnvironmentInitializer } from '@angular/core';
import { Routes } from '@angular/router';
import { Optimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonExampleConfigs, debugFields } from '../common';
import { appConfig } from './app.config';
import { additionalExamples } from './additional-examples';

export const appRoutes: Routes = [
  {
    path: '',
    component: ExamplesRouterViewerComponent,
    providers: [
      ...appConfig.providers,
      provideEnvironmentInitializer(() =>
        inject(Optimus).setConfig({ theme: { preset: Aura, options: { darkModeSelector: '[data-bs-theme="dark"]' } } }),
      ),
    ],
    data: {
      debugFields,
      type: 'optimus-ui',
      examples: [...CommonExampleConfigs, ...additionalExamples],
    },
  },
];
