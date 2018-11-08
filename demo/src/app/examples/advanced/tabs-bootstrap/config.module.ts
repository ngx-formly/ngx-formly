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
          examples: [{
            title: 'Multi step form ng-tabset',
            description: `
              This demonstrates using
              <code>ngb-tabset</code> inside of a custom type in order to create an multi step form.
            `,
            component: AppComponent,
            files: [
              { file: 'app.component.css', content: require('!!prismjs-loader?lang=css!./app.component.css'), filecontent: require('!!raw-loader?lang=css!./app.component.css') },
              { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./app.component.html'), filecontent: require('!!raw-loader?lang=html!./app.component.html') },
              { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.component.ts') },
              { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./app.module.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.module.ts') },
              { file: 'tab-type.component.ts', content: require('!!prismjs-loader?lang=typescript!./tab-type.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./tab-type.component.ts') },
            ],
          }],
        },
      },
    ]),
  ],
  entryComponents: [AppComponent],
})
export class ConfigModule { }
