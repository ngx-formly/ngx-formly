import { APP_INITIALIZER, Inject, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, CommonExampleConfigs, debugFields } from '../common';

import { AppComponent } from './app.component';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { IonicModule } from '@ionic/angular';

import { DatetimeAppModule, DatetimeExampleConfig } from './datetime';
import { RangeAppModule, RangeExampleConfig } from './range';
import { ToggleAppModule, ToggleExampleConfig } from './toggle';

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
          examples: [...CommonExampleConfigs, DatetimeExampleConfig, RangeExampleConfig, ToggleExampleConfig],
        },
      },
    ]),
  ],
  declarations: [AppComponent],
})
export class ConfigModule {
  constructor(@Inject(APP_INITIALIZER) appInitialize: any) {
    // temporary workaround to make ionic working in a child module
    appInitialize[0]();
  }
}
