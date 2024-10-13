import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule, FORMLY_CONFIG } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { MatTabsModule } from '@angular/material/tabs';

import { AppComponent } from './app.component';
import { FormlyPresetModule } from 'src/core/preset/src/preset.module';
import { registerGroupPreset } from './group.preset';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    FormlyBootstrapModule,
    FormlyPresetModule,
    FormlyModule.forRoot({
      presets: [
        {
          name: 'firstName',
          config: {
            key: 'firstName',
            type: 'input',
            props: {
              label: 'First Name',
            },
          },
        },
        {
          name: 'lastName',
          config: {
            key: 'lastName',
            type: 'input',
            props: {
              label: 'Last Name',
            },
          },
        },
      ],
    }),
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: FORMLY_CONFIG,
      useFactory: registerGroupPreset,
      multi: true,
    },
  ],
})
export class AppModule {}
