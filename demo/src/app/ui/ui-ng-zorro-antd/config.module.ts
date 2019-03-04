import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonModule, CommonExampleConfigs, CommonExampleComponents, debugFields } from '../common';

import { AppComponent } from './app.component';
import { FormlyNgZorroAntdModule } from '@ngx-formly/ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
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
              debugFields,
              examples: [...CommonExampleConfigs],
            },
          },
        ],
      },
    ]),
  ],
  declarations: [AppComponent],
  entryComponents: [AppComponent, ...CommonExampleComponents],
})
export class ConfigModule {}
