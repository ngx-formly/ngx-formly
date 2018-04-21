import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonModule, CommonExampleConfigs } from '../common';
import { DatepickerAppModule, DatepickerExampleConfig } from './datepicker';
import { ToggleAppModule, ToggleExampleConfig } from './toggle';
import { SliderAppModule, SliderExampleConfig } from './slider';
import { AutocompleteAppModule, AutocompleteExampleConfig } from './autocomplete';

import { FormlyMaterialModule } from '@ngx-formly/material';

@NgModule({
  imports: [
    CommonModule,
    FormlyMaterialModule,
    DatepickerAppModule,
    ToggleAppModule,
    SliderAppModule,
    AutocompleteAppModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExamplesRouterViewerComponent,
        data: {
          examples: [
            ...CommonExampleConfigs,
            DatepickerExampleConfig,
            ToggleExampleConfig,
            SliderExampleConfig,
            AutocompleteExampleConfig,
          ],
        },
      },
    ]),
  ],
})
export class ConfigModule { }
