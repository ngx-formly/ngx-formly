import { NgModule } from '@angular/core';
import { LegacyFormlySelectOptionsPipe } from './select-options.pipe';

@NgModule({
  declarations: [LegacyFormlySelectOptionsPipe],
  exports: [LegacyFormlySelectOptionsPipe],
})
export class FormlySelectModule {}
