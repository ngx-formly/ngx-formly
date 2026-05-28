import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { withFormlyFieldNativeSelect } from '@ngx-formly/material/native-select';

export const appConfig: ApplicationConfig = {
  providers: [provideFormlyCore([...withFormlyMaterial(), withFormlyFieldNativeSelect()])],
};
