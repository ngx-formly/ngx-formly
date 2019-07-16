import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonModule, CommonExampleConfigs, CommonExampleComponents, debugFields } from '../common';

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
          debugFields,
          examples: [
            ...CommonExampleConfigs,
          ],
        },
      },
    ]),
  ],
  entryComponents: [
    ...CommonExampleComponents,
  ],
})
export class ConfigModule { }
