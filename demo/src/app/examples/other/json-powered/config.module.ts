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
              { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./app.component.html'), filecontent: require('!!raw-loader?lang=html!./app.component.html') },
              { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.component.ts') },
              { file: 'user.service.ts', content: require('!!prismjs-loader?lang=typescript!./user.service.ts'), filecontent: require('!!raw-loader?lang=typescript!./user.service.ts') },
              // { file: 'user.json', content: require('!!prismjs-loader?lang=typescript!../../../../assets/json-powered/user.json'), filecontent: require('!!raw-loader?lang=typescript!../../../../assets/json-powered/user.json') },
              // { file: 'user-form.json', content: require('!!prismjs-loader?lang=typescript!../../../../assets/json-powered/user-form.json'), filecontent: require('!!raw-loader?lang=typescript!../../../../assets/json-powered/user-form.json') },
              { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./app.module.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.module.ts') },
            ],
          }],
        },
      },
    ]),
  ],
  entryComponents: [AppComponent],
})
export class ConfigModule { }
