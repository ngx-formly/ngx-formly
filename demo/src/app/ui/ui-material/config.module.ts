import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonModule, CommonExampleConfigs, debugFields } from '../common';
import { DatepickerAppModule, DatepickerExampleConfig } from './datepicker';
import { NativeSelectAppModule, NativeSelectExampleConfig } from './native-select';
import { ToggleAppModule, ToggleExampleConfig } from './toggle';
import { SliderAppModule, SliderExampleConfig } from './slider';
import { AutocompleteAppModule, AutocompleteExampleConfig } from './autocomplete';
import { FormlyMaterialModule } from '@ngx-formly/material';

@NgModule({
  imports: [
    CommonModule,
    FormlyMaterialModule,
    NativeSelectAppModule,
    DatepickerAppModule,
    ToggleAppModule,
    SliderAppModule,
    AutocompleteAppModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExamplesRouterViewerComponent,
        data: {
          debugFields,
          examples: [
            ...CommonExampleConfigs,
            NativeSelectExampleConfig,
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
export class ConfigModule {}
