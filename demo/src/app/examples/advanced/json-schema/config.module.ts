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
          examples: [
            {
              title: 'Json Schema',
              description: `
              Credits: The json-schema implementation is inspired by <a target="_blank" href="https://github.com/rjsf-team/react-jsonschema-form">react-jsonschema-form</a>
            `,
              component: AppComponent,
              debug: false,
              files: [
                {
                  file: 'app.component.html',
                  content: require('!!highlight-loader?raw=true&lang=html!./app.component.html'),
                  filecontent: require('!!raw-loader!./app.component.html'),
                },
                {
                  file: 'app.component.ts',
                  content: require('!!highlight-loader?raw=true&lang=typescript!./app.component.ts'),
                  filecontent: require('!!raw-loader!./app.component.ts'),
                },
                {
                  file: 'app.module.ts',
                  content: require('!!highlight-loader?raw=true&lang=typescript!./app.module.ts'),
                  filecontent: require('!!raw-loader!./app.module.ts'),
                },
                {
                  file: 'array.type.ts',
                  content: require('!!highlight-loader?raw=true&lang=typescript!./array.type.ts'),
                  filecontent: require('!!raw-loader!./array.type.ts'),
                },
                {
                  file: 'object.type.ts',
                  content: require('!!highlight-loader?raw=true&lang=typescript!./object.type.ts'),
                  filecontent: require('!!raw-loader!./object.type.ts'),
                },
                {
                  file: 'multischema.type.ts',
                  content: require('!!highlight-loader?raw=true&lang=typescript!./multischema.type.ts'),
                  filecontent: require('!!raw-loader!./multischema.type.ts'),
                },
                {
                  file: 'null.type.ts',
                  content: require('!!highlight-loader?raw=true&lang=typescript!./null.type.ts'),
                  filecontent: require('!!raw-loader!./null.type.ts'),
                },
                {
                  file: 'assets/json-schema/simple.json',
                  content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-schema/simple_json'),
                  filecontent: require('!!raw-loader!@assets/json-schema/simple_json'),
                },
                {
                  file: 'assets/json-schema/nested.json',
                  content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-schema/nested_json'),
                  filecontent: require('!!raw-loader!@assets/json-schema/nested_json'),
                },
                {
                  file: 'assets/json-schema/arrays.json',
                  content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-schema/arrays_json'),
                  filecontent: require('!!raw-loader!@assets/json-schema/arrays_json'),
                },
                {
                  file: 'assets/json-schema/numbers.json',
                  content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-schema/numbers_json'),
                  filecontent: require('!!raw-loader!@assets/json-schema/numbers_json'),
                },
                {
                  file: 'assets/json-schema/references.json',
                  content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-schema/references_json'),
                  filecontent: require('!!raw-loader!@assets/json-schema/references_json'),
                },
                {
                  file: 'assets/json-schema/schema_dependencies.json',
                  content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-schema/schema_dependencies_json'),
                  filecontent: require('!!raw-loader!@assets/json-schema/schema_dependencies_json'),
                },
                {
                  file: 'assets/json-schema/null_field.json',
                  content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-schema/null_field_json'),
                  filecontent: require('!!raw-loader!@assets/json-schema/null_field_json'),
                },
                {
                  file: 'assets/json-schema/nullable.json',
                  content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-schema/nullable_json'),
                  filecontent: require('!!raw-loader!@assets/json-schema/nullable_json'),
                },
                {
                  file: 'assets/json-schema/allOf.json',
                  content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-schema/allOf_json'),
                  filecontent: require('!!raw-loader!@assets/json-schema/allOf_json'),
                },
                {
                  file: 'assets/json-schema/anyOf.json',
                  content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-schema/anyOf_json'),
                  filecontent: require('!!raw-loader!@assets/json-schema/anyOf_json'),
                },
                {
                  file: 'assets/json-schema/oneOf.json',
                  content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-schema/oneOf_json'),
                  filecontent: require('!!raw-loader!@assets/json-schema/oneOf_json'),
                },
                {
                  file: 'assets/json-schema/select_alternatives.json',
                  content: require('!!highlight-loader?raw=true&lang=typescript!@assets/json-schema/select_alternatives_json'),
                  filecontent: require('!!raw-loader!@assets/json-schema/select_alternatives_json'),
                },
              ],
            },
          ],
        },
      },
    ]),
  ],
  entryComponents: [AppComponent],
})
export class ConfigModule {}
