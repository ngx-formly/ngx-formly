import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormlyNebularModule } from '@ngx-formly/ui/nebular';
import { AppComponent } from './app.component';
import { ExamplesRouterViewerComponent } from '../../shared';
import { CommonExampleConfigs, CommonModule, debugFields } from '../common';
import { NbLayoutModule } from '@nebular/theme';

@NgModule({
  declarations: [AppComponent],
  imports: [
    FormlyNebularModule,
    CommonModule,
    NbLayoutModule,
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
              examples: [...CommonExampleConfigs],
            },
          },
        ],
      },
    ]),
  ],
})
export class ConfigModule {}
