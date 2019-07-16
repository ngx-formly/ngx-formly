import { NgModule, APP_INITIALIZER, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, CommonExampleConfigs, CommonExampleComponents, debugFields } from '../common';

import { AppComponent } from './app.component';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { IonicModule } from '@ionic/angular';

import { DatetimeAppModule, DatetimeExampleConfig, DatetimeAppComponent } from './datetime';
import { RangeAppModule, RangeExampleConfig, RangeAppComponent } from './range';
import { ToggleAppModule, ToggleExampleConfig, ToggleAppComponent } from './toggle';

@NgModule({
  imports: [
    CommonModule,
    FormlyIonicModule,
    DatetimeAppModule,
    RangeAppModule,
    ToggleAppModule,
    IonicModule.forRoot(),

    RouterModule.forChild([
      {
        path: '',
        component: AppComponent,
        data: {
          debugFields,
          examples: [
            ...CommonExampleConfigs,
            DatetimeExampleConfig,
            RangeExampleConfig,
            ToggleExampleConfig,
          ],
        },
      },
    ]),
  ],
  declarations: [ AppComponent ],
  entryComponents: [
    AppComponent,
    ...CommonExampleComponents,
    DatetimeAppComponent,
    RangeAppComponent,
    ToggleAppComponent,
  ],
})
export class ConfigModule {
  constructor(@Inject(APP_INITIALIZER) appInitialize) {
    // temporary workaround to make ionic working in a child module
    appInitialize[0]();
  }
}
