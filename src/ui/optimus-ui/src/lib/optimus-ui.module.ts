import { NgModule } from '@angular/core';
import { FormlyFormFieldModule } from '@ngx-formly/optimus-ui/form-field';
import { FormlyInputModule } from '@ngx-formly/optimus-ui/input';
import { FormlyTextAreaModule } from '@ngx-formly/optimus-ui/textarea';
import { FormlyRadioModule } from '@ngx-formly/optimus-ui/radio';
import { FormlyCheckboxModule } from '@ngx-formly/optimus-ui/checkbox';
import { FormlySelectModule } from '@ngx-formly/optimus-ui/select';

@NgModule({
  imports: [
    FormlyFormFieldModule,
    FormlyInputModule,
    FormlyTextAreaModule,
    FormlyRadioModule,
    FormlyCheckboxModule,
    FormlySelectModule,
  ],
})
export class FormlyOptimusUIModule {}
