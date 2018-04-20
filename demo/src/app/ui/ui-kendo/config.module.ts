import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonModule, CommonExampleConfigs } from '../common';

import { AppComponent } from './app.component';
import { FormlyKendoModule } from '@ngx-formly/kendo';

@NgModule({
  imports: [
    CommonModule,
    FormlyKendoModule,
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
                ...CommonExampleConfigs,
              ],
            },
          },
        ],
      },
    ]),
  ],
  declarations: [ AppComponent ],
  entryComponents: [ AppComponent ],
})
export class ConfigModule { }
