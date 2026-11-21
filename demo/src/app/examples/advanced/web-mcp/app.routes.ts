import appComponentHtmlSource from './app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from './app.component.ts?raw' with { loader: 'text' };
import appConfigTsSource from './app.config.ts?raw' with { loader: 'text' };
import repeatSource from './repeat-section.type.ts?raw' with { loader: 'text' };
import { Routes } from '@angular/router';
import { ExamplesRouterViewerComponent } from '../../../shared/examples-router-viewer/examples-router-viewer.component';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

export const appRoutes: Routes = [
  {
    path: '',
    component: ExamplesRouterViewerComponent,
    providers: appConfig.providers,
    data: {
      examples: [
        {
          title: 'WebMCP',
          // Keep the generic model preview from displaying example passwords.
          debug: true,
          description:
            '<p>Expose selected fields to browser agents, preserve excluded values, and optionally allow submission.</p>',
          component: AppComponent,
          files: [
            { file: 'app.component.html', filecontent: appComponentHtmlSource },
            { file: 'app.component.ts', filecontent: appComponentTsSource },
            { file: 'app.config.ts', filecontent: appConfigTsSource },
            { file: 'repeat-section.type.ts', filecontent: repeatSource },
          ],
        },
      ],
    },
  },
];
