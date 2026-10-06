import { Routes } from '@angular/router';
import { CommonExampleConfigs, debugFields } from '../common';
import { appConfig } from './app.config';
import { additionalExamples } from './additional-examples';
import { AppComponent } from './app.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    providers: appConfig.providers,
    data: {
      debugFields,
      type: 'ionic',
      examples: [...CommonExampleConfigs, ...additionalExamples],
    },
  },
];
