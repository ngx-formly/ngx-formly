import appComponentHtmlSource from './app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from './app.component.ts?raw' with { loader: 'text' };
import appConfigTsSource from './app.config.ts?raw' with { loader: 'text' };
import translateExtensionTsSource from './translate.extension.ts?raw' with { loader: 'text' };
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
          title: 'i18n ngx-translate (alternative)',
          description: `
              This is an example of an alternative approach of using ngx-formly with ngx-translate to internationalize your forms.
              <div>
                This example demonstrates dynamic i18n using a extension enabling you to to directly work with translation ids.
                This approach is especially useful if you're sure that you always will use translation ids for your labels and placeholders.
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
              file: 'translate.extension.ts',
              filecontent: translateExtensionTsSource,
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
