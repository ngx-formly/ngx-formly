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
            title: 'Toggle required field',
            description: `
              This is an example of how to toggle <code>required</code> of a field. It uses:
              <ul>
                <li><code>expressionProperties</code>: to have formly add <code>required</code> to the input field</li>
                <li><code>validation.show</code>: to show validation errors even when they the field has not been touched</li>
                <li><code>validationMessages</code>: to add a globally available validation message</li>
              </ul>
            `,
            component: AppComponent,
            files: [
              { file: 'app.component.html', content: require('!!highlight-loader?raw=true&lang=html!./app.component.html'), filecontent: require('!!raw-loader!./app.component.html') },
              { file: 'app.component.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader!./app.component.ts') },
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
