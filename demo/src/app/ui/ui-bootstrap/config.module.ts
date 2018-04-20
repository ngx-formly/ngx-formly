import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonModule, CommonExampleConfigs } from '../common';

import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

@NgModule({
  imports: [
    FormlyBootstrapModule,

    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExamplesRouterViewerComponent,
        data: {
          examples: [
            ...CommonExampleConfigs,
          ],
        },
      },
    ]),
  ],
})
export class ConfigModule { }
