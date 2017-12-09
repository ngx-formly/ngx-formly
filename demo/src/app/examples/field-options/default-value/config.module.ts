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
            title: 'Default Value',
            description: `
              <div>
                There are two ways to initialize the form with default values.
                <ol>
                  <li>Default the model (preferred)</li>
                  <li>Use the
                    <code>defaultValue</code> option on the field</li>
                </ol>
                Both methods are demonstrated below.
              </div>
            `,
            component: AppComponent,
            files: [
              { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./app.component.html') },
              { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./app.component.ts') },
              { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./app.module.ts') },
            ],
          }],
        },
      },
    ]),
  ],
})
export class ConfigModule { }
