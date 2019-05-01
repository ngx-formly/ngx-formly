import { NgModule } from '@angular/core';
import { FormlyFormFieldModule } from '@ngx-formly/ionic/form-field';
import { FormlyInputModule } from '@ngx-formly/ionic/input';
import { FormlyTextAreaModule } from '@ngx-formly/ionic/textarea';
import { FormlyRadioModule } from '@ngx-formly/ionic/radio';
import { FormlyCheckboxModule } from '@ngx-formly/ionic/checkbox';
import { FormlySelectModule } from '@ngx-formly/ionic/select';
import { FormlyToggleModule } from '@ngx-formly/ionic/toggle';
import { FormlySliderModule } from '@ngx-formly/ionic/slider';
import { FormlyDatetimeModule } from '@ngx-formly/ionic/datetime';

@NgModule({
  imports: [
    FormlyFormFieldModule,
    FormlyInputModule,
    FormlyTextAreaModule,
    FormlyRadioModule,
    FormlyCheckboxModule,
    FormlySelectModule,
    FormlyToggleModule,
    FormlySliderModule,
    FormlyDatetimeModule,
  ],
  exports: [IonFormlyAttributes],
})
export class FormlyIonicModule { }

