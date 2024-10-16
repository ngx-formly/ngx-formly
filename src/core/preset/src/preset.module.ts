import { Component, ModuleWithProviders, NgModule } from '@angular/core';
import { FieldType, FormlyConfig, FormlyModule, FORMLY_CONFIG, PresetOption } from '@ngx-formly/core';
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
export class FormlyPresetModule {
  static forRoot(presets: PresetOption[]): ModuleWithProviders<FormlyPresetModule> {
    return {
      ngModule: FormlyPresetModule,
      providers: [
        {
          provide: FORMLY_CONFIG,
          multi: true,
          useValue: {
            presets,
          },
        },
      ],
    };
  }
}
