import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonModule, CommonExampleConfigs, CommonExampleComponents, debugFields } from '../common';

import { AppComponent } from './app.component';
import { FormlyNgZorroAntdModule } from '@ngx-formly/ng-zorro-antd';

import { NgZorroAntdModule, en_US, NZ_I18N } from 'ng-zorro-antd';

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
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
              examples: [
                ...CommonExampleConfigs,
              ],
            },
          },
        ],
      },
    ]),
  ],
  declarations: [AppComponent],
  entryComponents: [
    AppComponent,
    ...CommonExampleComponents,
  ],
  providers   : [ { provide: NZ_I18N, useValue: en_US } ],
})
export class ConfigModule { }
