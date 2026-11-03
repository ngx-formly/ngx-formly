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
          title: 'Signal Model',
          description: `
            <p>Pass a writable signal with <code>[model]="model"</code>.
            Edit either name to update the signal and the computed full name.
            Click "Load another name" to update the form with <code>model.set()</code>.</p>
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
