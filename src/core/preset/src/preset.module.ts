import { NgModule } from '@angular/core';
import { FormlyConfig, FormlyModule, FORMLY_CONFIG } from '@ngx-formly/core';
import { registerLibraryConfigReplacementExtension } from './preset-substitution.extension';

@NgModule({
  imports: [FormlyModule.forChild({})],
  providers: [
    {
      provide: FORMLY_CONFIG,
      useFactory: registerLibraryConfigReplacementExtension,
      deps: [FormlyConfig],
      multi: true,
    },
  ],
})
export class FormlyPresetModule {}
