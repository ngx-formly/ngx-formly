import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonModule, CommonExampleConfigs } from '../common';
import { DatepickerAppModule, DatepickerExampleConfig } from './datepicker';

import { FormlyMaterialModule } from '@ngx-formly/material';

@NgModule({
  imports: [
    CommonModule,
    DatepickerAppModule,
    FormlyMaterialModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExamplesRouterViewerComponent,
        data: {
          examples: [
            ...CommonExampleConfigs,
            DatepickerExampleConfig,
          ],
        },
      },
    ]),
  ],
})
export class ConfigModule { }
