import appComponentHtmlSource from './app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from './app.component.ts?raw' with { loader: 'text' };
import appConfigTsSource from './app.config.ts?raw' with { loader: 'text' };
import enJsonSource from '../../../../assets/i18n/en_json?raw' with { loader: 'text' };
import frJsonSource from '../../../../assets/i18n/fr_json?raw' with { loader: 'text' };
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
          title: 'i18n ngx-translate',
          description: `
              This is an example of using ngx-formly with ngx-translate to internationalize your forms.
              <div>
                This example demonstrates dynamic i18n using <code>expressions</code>.
                If you don't need a dynamic solution (language doesn't change after the app has started up,
                simply omit the <code>expressions</code> in the example.
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
            {
              file: 'assets/i18n/en.json',
              filecontent: enJsonSource,
            },
            {
              file: 'assets/i18n/fr.json',
              filecontent: frJsonSource,
            },
          ],
        },
      ],
    },
  },
];
