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
            title: 'Json Schema',
            component: AppComponent,
            debug: false,
            files: [
              { file: 'app.component.html', content: require('!!highlight-loader?raw=true&lang=html!./app.component.html'), filecontent: require('!!raw-loader!./app.component.html') },
              { file: 'app.component.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader!./app.component.ts') },
              { file: 'app.module.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./app.module.ts'), filecontent: require('!!raw-loader!./app.module.ts') },
              { file: 'array.type.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./array.type.ts'), filecontent: require('!!raw-loader!./array.type.ts') },
              { file: 'object.type.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./object.type.ts'), filecontent: require('!!raw-loader!./object.type.ts') },
              { file: 'assets/json-schema/simple.json', content: require('!!highlight-loader?raw=true&lang=typescript!./assets/simple_json'), filecontent: require('!!raw-loader!./assets/simple_json') },
              { file: 'assets/json-schema/nested.json', content: require('!!highlight-loader?raw=true&lang=typescript!./assets/nested_json'), filecontent: require('!!raw-loader!./assets/nested_json') },
              { file: 'assets/json-schema/arrays.json', content: require('!!highlight-loader?raw=true&lang=typescript!./assets/arrays_json'), filecontent: require('!!raw-loader!./assets/arrays_json') },
              { file: 'assets/json-schema/numbers.json', content: require('!!highlight-loader?raw=true&lang=typescript!./assets/numbers_json'), filecontent: require('!!raw-loader!./assets/numbers_json') },
              { file: 'assets/json-schema/references.json', content: require('!!highlight-loader?raw=true&lang=typescript!./assets/references_json'), filecontent: require('!!raw-loader!./assets/references_json') },
              { file: 'assets/json-schema/schema_dependencies.json', content: require('!!highlight-loader?raw=true&lang=typescript!./assets/schema_dependencies_json'), filecontent: require('!!raw-loader!./assets/schema_dependencies_json') },
              { file: 'assets/json-schema/allOf.json', content: require('!!highlight-loader?raw=true&lang=typescript!./assets/allOf_json'), filecontent: require('!!raw-loader!./assets/allOf_json') },
            ],
          }],
        },
      },
    ]),
  ],
  entryComponents: [
    AppComponent,
  ],
})
export class ConfigModule { }
