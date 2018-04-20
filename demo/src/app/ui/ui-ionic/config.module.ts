import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, CommonExampleConfigs } from '../common';

import { AppComponent } from './app.component';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { IonicApp, IonicModule } from 'ionic-angular';

import { DatetimeAppModule, DatetimeExampleConfig } from './datetime';
import { RangeAppModule, RangeExampleConfig } from './range';
import { ToggleAppModule, ToggleExampleConfig } from './toggle';

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
  entryComponents: [ AppComponent ],
})
export class ConfigModule { }
