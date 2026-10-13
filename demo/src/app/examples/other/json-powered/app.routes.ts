import appComponentHtmlSource from './app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from './app.component.ts?raw' with { loader: 'text' };
import userServiceTsSource from './user.service.ts?raw' with { loader: 'text' };
import userJsonSource from '../../../../assets/json-powered/user_json?raw' with { loader: 'text' };
import userFormJsonSource from '../../../../assets/json-powered/user-form_json?raw' with { loader: 'text' };
import colorsJsonSource from '../../../../assets/json-powered/colors_json?raw' with { loader: 'text' };
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
              filecontent: appComponentHtmlSource,
            },
            {
              file: 'app.component.ts',
              filecontent: appComponentTsSource,
            },
            {
              file: 'user.service.ts',
              filecontent: userServiceTsSource,
            },
            {
              file: 'assets/json-powered/user.json',
              filecontent: userJsonSource,
            },
            {
              file: 'assets/json-powered/user-form.json',
              filecontent: userFormJsonSource,
            },
            {
              file: 'assets/json-powered/colors.json',
              filecontent: colorsJsonSource,
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
