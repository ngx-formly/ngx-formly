import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';

import { InputAppModule } from '../common/input';
import { TextareaAppModule } from '../common/textarea';
import { CheckboxAppModule } from '../common/checkbox';
import { RadioAppModule } from '../common/radio';
import { SelectAppModule } from '../common/select';

@NgModule({
  imports: [InputAppModule, TextareaAppModule, CheckboxAppModule, RadioAppModule, SelectAppModule],
  exports: [SharedModule],
})
export class CommonModule {}
