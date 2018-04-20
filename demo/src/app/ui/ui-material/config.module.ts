import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonModule, CommonExampleConfigs } from '../common';

import { FormlyMaterialModule } from '@ngx-formly/material';

@NgModule({
  imports: [
    CommonModule,
    FormlyMaterialModule,
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
