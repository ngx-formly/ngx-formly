import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormlyNgZorroAntdModule } from '@ngx-formly/ng-zorro-antd';

import { SharedModule } from '../../shared';
import { AppComponent } from './app.component';
import { ExamplesRouterViewerComponent } from './examples-router-viewer/examples-router-viewer.component';
import { NG_ZORRO_COMPONENTS, NG_ZORRO_EXAMPLE_CONFIGS, NG_ZORRO_EXAMPLE_MODULE } from './index';

@NgModule({
  imports: [
    SharedModule,
    ...NG_ZORRO_EXAMPLE_MODULE,
    FormlyNgZorroAntdModule,
    RouterModule.forChild([
      {
        path: '',
        component: AppComponent,
        children: [
          {
            path: '',
            component: ExamplesRouterViewerComponent,
            data: {
              examples: [
                ...NG_ZORRO_EXAMPLE_CONFIGS,
              ],
            },
          },
        ],
      },
    ]),
  ],
  declarations: [ AppComponent, ExamplesRouterViewerComponent ],
  entryComponents: [
    AppComponent,
    ...NG_ZORRO_COMPONENTS,
  ],
})
export class ConfigModule { }
