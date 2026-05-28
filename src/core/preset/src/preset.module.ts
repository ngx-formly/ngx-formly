import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { provideFormlyPreset } from './preset.config';

@NgModule({
  imports: [FormlyModule.forChild({})],
  providers: [provideFormlyPreset()],
})
export class FormlyPresetModule {}
