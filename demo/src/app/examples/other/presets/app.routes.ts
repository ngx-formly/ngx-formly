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
          title: 'Field Presets',
          description: `
              This example demonstrates how to use the <code>preset</code> feature.
              The displayed fields are all standard fields that are defined locally and then re-used in the form.
              Check out the salutation field to get an idea of how to create smart, self-configuring presets with dependencies.
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
              file: 'salutation.preset.ts',
              content: require('!!highlight-loader?raw=true&lang=typescript!./salutation.preset.ts'),
              filecontent: require('!!raw-loader!./salutation.preset.ts'),
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
