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
              file: 'translate.extension.ts',
              content: require('!!highlight-loader?raw=true&lang=typescript!./translate.extension.ts'),
              filecontent: require('!!raw-loader!./translate.extension.ts'),
            },
            {
              file: 'assets/i18n/en.json',
              content: require('!!highlight-loader?raw=true&lang=typescript!@assets/i18n/en_json'),
              filecontent: require('!!raw-loader!@assets/i18n/en_json'),
            },
            {
              file: 'assets/i18n/fr.json',
              content: require('!!highlight-loader?raw=true&lang=typescript!@assets/i18n/fr_json'),
              filecontent: require('!!raw-loader!@assets/i18n/fr_json'),
            },
          ],
        },
      ],
    },
  },
];
