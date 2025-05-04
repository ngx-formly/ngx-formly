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
          title: 'Grid',
          description: `
              This demonstrates using
              <code>ag-grid</code> inside of a custom type in order to create an input grid.
            `,
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
              file: 'app.config.ts',
              content: require('!!highlight-loader?raw=true&lang=typescript!./app.config.ts'),
              filecontent: require('!!raw-loader!./app.config.ts'),
            },
            {
              file: 'grid.type.ts',
              content: require('!!highlight-loader?raw=true&lang=typescript!./grid.type.ts'),
              filecontent: require('!!raw-loader!./grid.type.ts'),
            },
            {
              file: 'grid-formly-cell.component.ts',
              content: require('!!highlight-loader?raw=true&lang=typescript!./grid-formly-cell.component.ts'),
              filecontent: require('!!raw-loader!./grid-formly-cell.component.ts'),
            },
          ],
        },
      ],
    },
  },
];
