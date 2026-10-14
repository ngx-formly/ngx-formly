import appComponentHtmlSource from './app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from './app.component.ts?raw' with { loader: 'text' };
import appConfigTsSource from './app.config.ts?raw' with { loader: 'text' };
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
          title: 'Hide Fields',
          description: `
              <code>expressions</code> is used to set the
              <code>hide</code> property of your field conditionally based on model value.
              The code editors use <code>shareFormControl: false</code> to keep their parsers and
              validators separate, and <code>resetOnHide: false</code> to retain the value when switching.
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
          ],
        },
      ],
    },
  },
];
