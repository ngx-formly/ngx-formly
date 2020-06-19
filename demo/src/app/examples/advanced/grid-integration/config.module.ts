import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule, ExamplesRouterViewerComponent } from '../../../shared';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    SharedModule,
    AppModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExamplesRouterViewerComponent,
        data: {
          examples: [
            {
              title: 'Grid',
              description: `
              This demonstrates using
              <code>ag-grid</code> inside of a custom type in order to create an input grid.
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
                  file: 'app.module.ts',
                  content: require('!!highlight-loader?raw=true&lang=typescript!./app.module.ts'),
                  filecontent: require('!!raw-loader!./app.module.ts'),
                },
                {
                  file: 'grid.type.ts',
                  content: require('!!highlight-loader?raw=true&lang=typescript!./grid.type.ts'),
                  filecontent: require('!!raw-loader!./grid.type.ts'),
                },
                {
                  file: 'grid-formly-cell.component.ts',
                  content: require('!!highlight-loader?raw=true&lang=typescript!./grid-formly-cell.component.ts'),
                  filecontent: require('!!raw-loader!./grid-formly-cell.component.ts'),
                },
              ],
            },
          ],
        },
      },
    ]),
  ],
})
export class ConfigModule {}
