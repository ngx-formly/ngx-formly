import { Routes } from '@angular/router';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonExampleConfigs, debugFields } from '../common';
import { appConfig } from './app.config';
import { additionalExamples } from './additional-examples';
import { AppComponent } from './app.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    providers: appConfig.providers,
    children: [
      {
        path: '',
        component: ExamplesRouterViewerComponent,
        data: {
          debugFields,
          type: 'ng-zorro-antd',
          examples: [...CommonExampleConfigs, ...additionalExamples],
        },
      },
    ],
  },
];
