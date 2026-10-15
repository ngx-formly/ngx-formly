import { Routes } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyIonic } from '@ngx-formly/ionic';
import { withFormlyFieldDatetime } from '@ngx-formly/ionic/datetime';
import { withFormlyFieldSlider } from '@ngx-formly/ionic/slider';
import { withFormlyFieldToggle } from '@ngx-formly/ionic/toggle';
import { UIComponent } from './ui.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: UIComponent,
    providers: [
      provideIonicAngular(),
      provideFormlyCore([
        ...withFormlyIonic(),
        withFormlyFieldDatetime(),
        withFormlyFieldSlider(),
        withFormlyFieldToggle(),
      ]),
    ],
  },
];
