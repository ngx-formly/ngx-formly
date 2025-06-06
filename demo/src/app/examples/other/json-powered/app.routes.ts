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
          title: 'JSON powered',
          description: `
              This is an example of powering a form strictly by JSON. The common use case for this
              would be to persist the form configuration in the database and then send the configuration
              up to power the form. Notice that you can still use most features like <code>expressions</code>
              and <code>validators</code> even in a string form.

              <br/>
              For more advanced cases where javascript is needed (For example bind an observable to select options) a map function can be used to adjust the loaded JSON form.
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
              file: 'user.service.ts',
              content: require('!!highlight-loader?raw=true&lang=typescript!./user.service.ts'),
              filecontent: require('!!raw-loader!./user.service.ts'),
            },
            {
              file: 'assets/json-powered/user.json',
              content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-powered/user_json'),
              filecontent: require('!!raw-loader!@assets/json-powered/user_json'),
            },
            {
              file: 'assets/json-powered/user-form.json',
              content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-powered/user-form_json'),
              filecontent: require('!!raw-loader!@assets/json-powered/user-form_json'),
            },
            {
              file: 'assets/json-powered/colors.json',
              content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-powered/colors_json'),
              filecontent: require('!!raw-loader!@assets/json-powered/colors_json'),
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
