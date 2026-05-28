import { Provider } from '@angular/core';
import { FormlyConfig, FORMLY_CONFIG } from '@ngx-formly/core';
import { registerLibraryConfigReplacementExtension } from './preset-substitution.extension';

export function provideFormlyPreset(): Provider {
  return {
    provide: FORMLY_CONFIG,
    useFactory: registerLibraryConfigReplacementExtension,
    deps: [FormlyConfig],
    multi: true,
  };
}
