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
            title: 'Material Prefix and Suffix',
            description: `
              This demonstrates adding a material suffix and prefix for material form fields.
            `,
            component: AppComponent,
            files: [
              { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./app.component.html'), filecontent: require('!!raw-loader?lang=html!./app.component.html') },
              { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.component.ts') },
              { file: 'addons.wrapper.ts', content: require('!!prismjs-loader?lang=typescript!./addons.wrapper.ts'), filecontent: require('!!raw-loader?lang=typescript!./addons.wrapper.ts') },
              { file: 'addons.extension.ts', content: require('!!prismjs-loader?lang=typescript!./addons.extension.ts'), filecontent: require('!!raw-loader?lang=typescript!./addons.extension.ts') },
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
