import appComponentHtmlSource from './app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from './app.component.ts?raw' with { loader: 'text' };
import appConfigTsSource from './app.config.ts?raw' with { loader: 'text' };
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ExamplesRouterViewerComponent } from '../../../shared/examples-router-viewer/examples-router-viewer.component';
import { appConfig } from './app.config';

export const appRoutes: Routes = [
  {
    path: '',
    component: ExamplesRouterViewerComponent,
    providers: appConfig.providers,
    data: {
      examples: [
        {
          title: 'Signal Forms (experimental)',
          description: `
            <p>Work in progress for <a href="https://github.com/ngx-formly/ngx-formly/issues/4241">#4241</a>.
            With <code>options.signalForms</code>, Formly creates a <code>SignalFormControl</code> for each keyed field
            and applies <code>props.required</code> / <code>props.disabled</code> as Signal Forms rules. The model is a
            signal and the summary is a <code>computed()</code>.</p>
          `,
          component: AppComponent,
          files: [
            { file: 'app.component.html', filecontent: appComponentHtmlSource },
            { file: 'app.component.ts', filecontent: appComponentTsSource },
            { file: 'app.config.ts', filecontent: appConfigTsSource },
          ],
        },
      ],
    },
  },
];
