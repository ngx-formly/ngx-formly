import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonModule, CommonExampleConfigs, CommonExampleComponents, debugFields } from '../common';
import { DatepickerAppModule, DatepickerExampleConfig, DatepickerAppComponent } from './datepicker';
import { ToggleAppModule, ToggleExampleConfig, ToggleAppComponent } from './toggle';
import { SliderAppModule, SliderExampleConfig, SliderAppComponent } from './slider';
import { AutocompleteAppModule, AutocompleteExampleConfig, AutocompleteAppComponent } from './autocomplete';
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
          debugFields,
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
  entryComponents: [
    ...CommonExampleComponents,

    DatepickerAppComponent,
    ToggleAppComponent,
    SliderAppComponent,
    AutocompleteAppComponent,
  ],
})
export class ConfigModule { }
