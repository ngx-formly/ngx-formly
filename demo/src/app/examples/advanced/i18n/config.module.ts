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
            title: 'i18n using ngx-translate',
            description: `
              This is an example of using ngx-formly with ngx-translate to internationalize your forms.
              <div>
                This example demonstrates dynamic i18n using <code>expressionProperties</code>.
                If you don't need a dynamic solution (language doesn't change after the app has started up,
                simply omit the <code>expressionProperties</code> in the example.
              </div>
            `,
            component: AppComponent,
            files: [
              { file: 'app.component.html', content: require('!!highlight-loader?raw=true&lang=html!./app.component.html'), filecontent: require('!!raw-loader!./app.component.html') },
              { file: 'app.component.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader!./app.component.ts') },
              { file: 'app.module.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./app.module.ts'), filecontent: require('!!raw-loader!./app.module.ts') },
              { file: 'assets/i18n/en.json', content: require('!!highlight-loader?raw=true&lang=typescript!./assets/en_json'), filecontent: require('!!raw-loader!./assets/en_json') },
              { file: 'assets/i18n/fr.json', content: require('!!highlight-loader?raw=true&lang=typescript!./assets/fr_json'), filecontent: require('!!raw-loader!./assets/fr_json') },
            ],
          }],
        },
      },
    ]),
  ],
  entryComponents: [AppComponent],
})
export class ConfigModule { }
