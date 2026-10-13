import appComponentHtmlSource from './app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from './app.component.ts?raw' with { loader: 'text' };
import appConfigTsSource from './app.config.ts?raw' with { loader: 'text' };
import gridTypeTsSource from './grid.type.ts?raw' with { loader: 'text' };
import gridFormlyCellComponentTsSource from './grid-formly-cell.component.ts?raw' with { loader: 'text' };
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
              filecontent: appComponentHtmlSource,
            },
            {
              file: 'app.component.ts',
              filecontent: appComponentTsSource,
            },
            {
              file: 'app.config.ts',
              filecontent: appConfigTsSource,
            },
            {
              file: 'grid.type.ts',
              filecontent: gridTypeTsSource,
            },
            {
              file: 'grid-formly-cell.component.ts',
              filecontent: gridFormlyCellComponentTsSource,
            },
          ],
        },
      ],
    },
  },
];
