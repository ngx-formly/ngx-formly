import { Routes } from '@angular/router';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonExampleConfigs, debugFields } from '../common';
import { appConfig } from './app.config';
import { additionalExamples } from './additional-examples';

export const appRoutes: Routes = [
  {
    path: '',
    component: ExamplesRouterViewerComponent,
    providers: appConfig.providers,
    data: {
      debugFields,
      type: 'bootstrap',
      examples: [...CommonExampleConfigs, ...additionalExamples],
    },
  },
];
