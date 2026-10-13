import appComponentHtmlSource from './app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from './app.component.ts?raw' with { loader: 'text' };
import appConfigTsSource from './app.config.ts?raw' with { loader: 'text' };
import arrayTypeTsSource from './array.type.ts?raw' with { loader: 'text' };
import objectTypeTsSource from './object.type.ts?raw' with { loader: 'text' };
import multischemaTypeTsSource from './multischema.type.ts?raw' with { loader: 'text' };
import nullTypeTsSource from './null.type.ts?raw' with { loader: 'text' };
import simpleJsonSource from '../../../../assets/json-schema/simple_json?raw' with { loader: 'text' };
import nestedJsonSource from '../../../../assets/json-schema/nested_json?raw' with { loader: 'text' };
import arraysJsonSource from '../../../../assets/json-schema/arrays_json?raw' with { loader: 'text' };
import numbersJsonSource from '../../../../assets/json-schema/numbers_json?raw' with { loader: 'text' };
import referencesJsonSource from '../../../../assets/json-schema/references_json?raw' with { loader: 'text' };
import schemaDependenciesJsonSource from '../../../../assets/json-schema/schema_dependencies_json?raw' with {
  loader: 'text',
};
import nullFieldJsonSource from '../../../../assets/json-schema/null_field_json?raw' with { loader: 'text' };
import nullableJsonSource from '../../../../assets/json-schema/nullable_json?raw' with { loader: 'text' };
import allOfJsonSource from '../../../../assets/json-schema/allOf_json?raw' with { loader: 'text' };
import anyOfJsonSource from '../../../../assets/json-schema/anyOf_json?raw' with { loader: 'text' };
import oneOfJsonSource from '../../../../assets/json-schema/oneOf_json?raw' with { loader: 'text' };
import selectAlternativesJsonSource from '../../../../assets/json-schema/select_alternatives_json?raw' with {
  loader: 'text',
};
import ifThenElseJsonSource from '../../../../assets/json-schema/if_then_else_json?raw' with { loader: 'text' };
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ExamplesRouterViewerComponent } from 'demo/src/app/shared';
import { appConfig } from './app.config';

export const appRoutes: Routes = [
  {
    path: '',
    component: ExamplesRouterViewerComponent,
    providers: appConfig.providers,
    data: {
      examples: [
        {
          title: 'JSON Schema',
          description: `
              <strong>To customize JSON Schema output</strong>, please check <a target="_parent" href="https://formly.dev/docs/guide/json-schema#customize-json-schema-output">JSON Schema Guide</a>

              </br></br>
              <small class="text-muted">Credits: The JSON Schema implementation is inspired by <a target="_blank" href="https://github.com/rjsf-team/react-jsonschema-form">react-jsonschema-form</a></small>
            `,
          component: AppComponent,
          debug: false,
          files: [
            {
              file: 'app.component.html',
              filecontent: appComponentHtmlSource,
            },
            {
              file: 'app.component.ts',
              filecontent: appComponentTsSource,
            },
            {
              file: 'app.config.ts',
              filecontent: appConfigTsSource,
            },
            {
              file: 'array.type.ts',
              filecontent: arrayTypeTsSource,
            },
            {
              file: 'object.type.ts',
              filecontent: objectTypeTsSource,
            },
            {
              file: 'multischema.type.ts',
              filecontent: multischemaTypeTsSource,
            },
            {
              file: 'null.type.ts',
              filecontent: nullTypeTsSource,
            },
            {
              file: 'assets/json-schema/simple.json',
              filecontent: simpleJsonSource,
            },
            {
              file: 'assets/json-schema/nested.json',
              filecontent: nestedJsonSource,
            },
            {
              file: 'assets/json-schema/arrays.json',
              filecontent: arraysJsonSource,
            },
            {
              file: 'assets/json-schema/numbers.json',
              filecontent: numbersJsonSource,
            },
            {
              file: 'assets/json-schema/references.json',
              filecontent: referencesJsonSource,
            },
            {
              file: 'assets/json-schema/schema_dependencies.json',
              filecontent: schemaDependenciesJsonSource,
            },
            {
              file: 'assets/json-schema/null_field.json',
              filecontent: nullFieldJsonSource,
            },
            {
              file: 'assets/json-schema/nullable.json',
              filecontent: nullableJsonSource,
            },
            {
              file: 'assets/json-schema/allOf.json',
              filecontent: allOfJsonSource,
            },
            {
              file: 'assets/json-schema/anyOf.json',
              filecontent: anyOfJsonSource,
            },
            {
              file: 'assets/json-schema/oneOf.json',
              filecontent: oneOfJsonSource,
            },
            {
              file: 'assets/json-schema/select_alternatives.json',
              filecontent: selectAlternativesJsonSource,
            },
            {
              file: 'assets/json-schema/if_then_else.json',
              filecontent: ifThenElseJsonSource,
            },
          ],
        },
      ],
    },
  },
];
