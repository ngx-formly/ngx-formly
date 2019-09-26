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
            title: 'JSON powered',
            description: `
              This is an example of powering a form strictly by JSON. The common use case for this
              would be to persist the form configuration in the database and then send the configuration
              up to power the form. Notice that you can still use most features like <code>expressionProperties</code>
              and <code>validators</code> even in a string form.
            `,
            component: AppComponent,
            files: [
              { file: 'app.component.html', content: require('!!highlight-loader?raw=true&lang=html!./app.component.html'), filecontent: require('!!raw-loader!./app.component.html') },
              { file: 'app.component.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader!./app.component.ts') },
              { file: 'user.service.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./user.service.ts'), filecontent: require('!!raw-loader!./user.service.ts') },
              { file: 'assets/json-powered/user.json', content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-powered/user_json'), filecontent: require('!!raw-loader!@assets/json-powered/user_json') },
              { file: 'assets/json-powered/user-form.json', content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-powered/user-form_json'), filecontent: require('!!raw-loader!@assets/json-powered/user-form_json') },
              { file: 'app.module.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./app.module.ts'), filecontent: require('!!raw-loader!./app.module.ts') },
            ],
          }],
        },
      },
    ]),
  ],
  entryComponents: [AppComponent],
})
export class ConfigModule { }
