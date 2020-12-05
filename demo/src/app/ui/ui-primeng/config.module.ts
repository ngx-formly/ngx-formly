import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonModule, CommonExampleConfigs, CommonExampleComponents, debugFields } from '../common';

import { AppComponent } from './app.component';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { DatepickerExampleConfig } from './datepicker';

@NgModule({
  imports: [
    CommonModule,
    FormlyPrimeNGModule,
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
              examples: [...CommonExampleConfigs, DatepickerExampleConfig],
            },
          },
        ],
      },
    ]),
  ],
  declarations: [AppComponent],
})
export class ConfigModule {}
