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
              title: 'Bootstrap Horizontal',
              description: ``,
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
                  file: 'horizontal-wrapper.ts',
                  content: require('!!highlight-loader?raw=true&lang=typescript!./horizontal-wrapper.ts'),
                  filecontent: require('!!raw-loader!./horizontal-wrapper.ts'),
                },
              ],
            },
          ],
        },
      },
    ]),
  ],
  entryComponents: [AppComponent],
})
export class ConfigModule {}
