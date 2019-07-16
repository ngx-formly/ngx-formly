import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule, ExamplesRouterViewerComponent } from '../../../shared';
import { SimpleAppModule, SimpleAppComponent, SimpleExampleConfig } from './simple';
import { NumbersAppModule, NumbersAppComponent, NumbersExampleConfig } from './numbers';
import { NestedAppModule, NestedAppComponent, NestedExampleConfig } from './nested';
import { ArraysAppModule, ArraysAppComponent, ArraysExampleConfig } from './arrays';

@NgModule({
  imports: [
    SharedModule,
    SimpleAppModule,
    NumbersAppModule,
    NestedAppModule,
    ArraysAppModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExamplesRouterViewerComponent,
        data: {
          examples: [
            SimpleExampleConfig,
            NumbersExampleConfig,
            NestedExampleConfig,
            ArraysExampleConfig,
          ],
        },
      },
    ]),
  ],
  entryComponents: [
    SimpleAppComponent,
    NumbersAppComponent,
    NestedAppComponent,
    ArraysAppComponent,
  ],
})
export class ConfigModule { }
