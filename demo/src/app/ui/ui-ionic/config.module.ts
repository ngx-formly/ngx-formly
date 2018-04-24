import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, CommonExampleConfigs, CommonExampleComponents } from '../common';

import { AppComponent } from './app.component';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { IonicApp, IonicModule } from 'ionic-angular';

import { DatetimeAppModule, DatetimeExampleConfig, DatetimeAppComponent } from './datetime';
import { RangeAppModule, RangeExampleConfig, RangeAppComponent } from './range';
import { ToggleAppModule, ToggleExampleConfig, ToggleAppComponent } from './toggle';

@NgModule({
  imports: [
    CommonModule,
    FormlyIonicModule,
    IonicModule.forRoot(AppComponent),
    DatetimeAppModule,
    RangeAppModule,
    ToggleAppModule,

    RouterModule.forChild([
      {
        path: '',
        component: IonicApp,
        data: {
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
export class ConfigModule { }
