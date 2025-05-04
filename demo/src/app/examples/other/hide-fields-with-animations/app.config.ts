import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore, FormlyFieldConfig } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

import { AnimationWrapperComponent } from './animation-wrapper.component';

export function animationExtension(field: FormlyFieldConfig) {
  if (field.wrappers && field.wrappers.includes('animation')) {
    return;
  }

  field.wrappers = ['animation', ...(field.wrappers || [])];
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        extras: { lazyRender: false },
        wrappers: [{ name: 'animation', component: AnimationWrapperComponent }],
        extensions: [{ name: 'animation', extension: { onPopulate: animationExtension } }],
      },
    ]),
  ],
};
