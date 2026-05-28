import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { withFormlyFieldSlider } from '@ngx-formly/material/slider';

export const appConfig: ApplicationConfig = {
  providers: [provideFormlyCore([...withFormlyMaterial(), withFormlyFieldSlider()])],
};
