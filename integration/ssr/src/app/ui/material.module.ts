import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
import { FormlyMatNativeSelectModule } from '@ngx-formly/material/native-select';
import { FormlyMatSliderModule } from '@ngx-formly/material/slider';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { UIModule } from './ui.module';
import { UIComponent } from './ui.component';

@NgModule({
  imports: [
    UIModule,
    FormlyMaterialModule,
    FormlyMatToggleModule,
    FormlyMatNativeSelectModule,
    FormlyMatSliderModule,
    FormlyMatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forChild([
      {
        path: '',
        component: UIComponent,
      },
    ]),
  ],
  providers: [],
})
export class UIMaterialModule {}
