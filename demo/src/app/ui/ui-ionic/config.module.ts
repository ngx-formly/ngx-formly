import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, CommonExampleConfigs } from '../common';

import { AppComponent } from './app.component';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { IonicApp, IonicModule } from 'ionic-angular';

@NgModule({
  imports: [
    CommonModule,
    FormlyIonicModule,
    IonicModule.forRoot(AppComponent),

    RouterModule.forChild([
      {
        path: '',
        component: IonicApp,
        data: {
          examples: [
            ...CommonExampleConfigs,
          ],
        },
      },
    ]),
  ],
  declarations: [ AppComponent ],
  entryComponents: [ AppComponent ],
})
export class ConfigModule { }
