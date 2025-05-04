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
