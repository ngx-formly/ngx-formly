import { Routes } from '@angular/router';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { UIComponent } from './ui.component';
import { withFormlyFieldNativeSelect } from '@ngx-formly/material/native-select';
import { withFormlyFieldDatepicker } from '@ngx-formly/material/datepicker';
import { withFormlyFieldSlider } from '@ngx-formly/material/slider';
import { withFormlyFieldToggle } from '@ngx-formly/material/toggle';

export const appRoutes: Routes = [
  {
    path: '',
    component: UIComponent,
    providers: [
      provideFormlyCore([
        ...withFormlyMaterial(),
        withFormlyFieldNativeSelect(),
        withFormlyFieldDatepicker(),
        withFormlyFieldSlider(),
        withFormlyFieldToggle(),
      ]),
    ],
  },
];
