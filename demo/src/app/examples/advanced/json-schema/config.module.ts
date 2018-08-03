import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule, ExamplesRouterViewerComponent } from '../../../shared';
import { SimpleAppModule, SimpleAppComponent } from './simple';
import { NumbersAppModule, NumbersAppComponent } from './numbers';
import { NestedAppModule, NestedAppComponent } from './nested';
import { ArraysAppModule, ArraysAppComponent } from './arrays';

@NgModule({
  imports: [
    SharedModule,
    SimpleAppModule,
    NumbersAppModule,
    NestedAppModule,
    ArraysAppModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExamplesRouterViewerComponent,
        data: {
          examples: [
            {
              title: 'json-schema simple',
              component: SimpleAppComponent,
              files: [
                { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./simple/app.component.html'), filecontent: require('!!raw-loader?lang=html!./simple/app.component.html') },
                { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./simple/app.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./simple/app.component.ts') },
                { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./simple/app.module.ts'), filecontent: require('!!raw-loader?lang=typescript!./simple/app.module.ts') },
                { file: 'array.type.ts', content: require('!!prismjs-loader?lang=typescript!./simple/array.type.ts'), filecontent: require('!!raw-loader?lang=typescript!./simple/array.type.ts') },
              ],
            },
            {
              title: 'json-schema nested',
              component: NestedAppComponent,
              files: [
                { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./nested/app.component.html'), filecontent: require('!!raw-loader?lang=html!./nested/app.component.html') },
                { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./nested/app.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./nested/app.component.ts') },
                { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./nested/app.module.ts'), filecontent: require('!!raw-loader?lang=typescript!./nested/app.module.ts') },
                { file: 'array.type.ts', content: require('!!prismjs-loader?lang=typescript!./nested/array.type.ts'), filecontent: require('!!raw-loader?lang=typescript!./nested/array.type.ts') },
              ],
            },
            {
              title: 'json-schema numbers',
              component: NumbersAppComponent,
              files: [
                { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./numbers/app.component.html'), filecontent: require('!!raw-loader?lang=html!./numbers/app.component.html') },
                { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./numbers/app.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./numbers/app.component.ts') },
                { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./numbers/app.module.ts'), filecontent: require('!!raw-loader?lang=typescript!./numbers/app.module.ts') },
                { file: 'array.type.ts', content: require('!!prismjs-loader?lang=typescript!./numbers/array.type.ts'), filecontent: require('!!raw-loader?lang=typescript!./numbers/array.type.ts') },
              ],
            },
            {
              title: 'json-schema arrays (Partial support)',
              component: ArraysAppComponent,
              files: [
                { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./arrays/app.component.html'), filecontent: require('!!raw-loader?lang=html!./arrays/app.component.html') },
                { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./arrays/app.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./arrays/app.component.ts') },
                { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./arrays/app.module.ts'), filecontent: require('!!raw-loader?lang=typescript!./arrays/app.module.ts') },
                { file: 'array.type.ts', content: require('!!prismjs-loader?lang=typescript!./arrays/array.type.ts'), filecontent: require('!!raw-loader?lang=typescript!./arrays/array.type.ts') },
              ],
            },
          ],
        },
      },
    ]),
  ],
})
export class ConfigModule { }
