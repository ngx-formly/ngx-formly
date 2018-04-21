import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule, ExamplesRouterViewerComponent } from '../../shared';
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
            title: 'Introduction Example',
            description: `This is a small subset of the things that formly can do :-) See the other examples and the documentation for more.`,
            component: AppComponent,
            files: [
              { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./app.component.html'), filecontent: require('!!raw-loader?lang=html!./app.component.html') },
              { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.component.ts') },
              { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./app.module.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.module.ts') },
              { file: 'custom-input.component.ts', content: require('!!prismjs-loader?lang=typescript!./custom-input.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./custom-input.component.ts') },
            ],
          }],
        },
      },
    ]),
  ],
  entryComponents: [ AppComponent ],
})
export class ConfigModule { }
