import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ExamplesRouterViewerComponent } from 'demo/src/app/shared';
import { appConfig } from './app.config';

export const appRoutes: Routes = [
  {
    path: '',
    component: ExamplesRouterViewerComponent,
    providers: appConfig.providers,
    data: {
      examples: [
        {
          title: 'Hide fields with `@angular/animations`',
          component: AppComponent,
          files: [
            {
              file: 'app.component.html',
              content: require('!!highlight-loader?raw=true&lang=html!./app.component.html'),
              filecontent: require('!!raw-loader!./app.component.html'),
            },
            {
              file: 'app.component.ts',
              content: require('!!highlight-loader?raw=true&lang=typescript!./app.component.ts'),
              filecontent: require('!!raw-loader!./app.component.ts'),
            },
            {
              file: 'animation-wrapper.component.ts',
              content: require('!!highlight-loader?raw=true&lang=typescript!./animation-wrapper.component.ts'),
              filecontent: require('!!raw-loader!./animation-wrapper.component.ts'),
            },
            {
              file: 'app.config.ts',
              content: require('!!highlight-loader?raw=true&lang=typescript!./app.config.ts'),
              filecontent: require('!!raw-loader!./app.config.ts'),
            },
          ],
        },
      ],
    },
  },
];
