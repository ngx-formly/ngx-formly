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
            title: 'File input',
            component: AppComponent,
            files: [
              { file: 'app.component.html', content: require('!!highlight-loader?raw=true&lang=html!./app.component.html'), filecontent: require('!!raw-loader!./app.component.html') },
              { file: 'app.component.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader!./app.component.ts') },
              { file: 'file-value-accessor.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./file-value-accessor.ts'), filecontent: require('!!raw-loader!./file-value-accessor.ts') },
              { file: 'file-type.component.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./file-type.component.ts'), filecontent: require('!!raw-loader!./file-type.component.ts') },
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
