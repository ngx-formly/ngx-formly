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
          title: 'Reset Model',
          description: `
              <h3>Reset and Update Initial Values</h3>
              <div>
                Just try this:
                <ol>
                  <li>Fill out some fields</li>
                  <li>Click "Reset"</li>
                  <li>Fill out fields again</li>
                  <li>Click "Update Initial Values"</li>
                  <li>Click "Reset"</li>
                  <li>Change some fields</li>
                  <li>Click "Reset"</li>
                </ol>
              </div>
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
