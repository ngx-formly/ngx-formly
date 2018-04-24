import { InputAppModule, InputAppComponent, InputExampleConfig } from '../common/input';
import { TextareaAppModule, TextareaAppComponent, TextareaExampleConfig } from '../common/textarea';
import { CheckboxAppModule, CheckboxAppComponent, CheckboxExampleConfig } from '../common/checkbox';
import { RadioAppModule, RadioAppComponent, RadioExampleConfig } from '../common/radio';
import { SelectAppModule, SelectAppComponent, SelectExampleConfig } from '../common/select';

import { CommonModule } from './common.module';

const CommonExampleConfigs = [
  InputExampleConfig,
  TextareaExampleConfig,
  CheckboxExampleConfig,
  RadioExampleConfig,
  SelectExampleConfig,
];

const CommonExampleComponents = [
  InputAppComponent,
  TextareaAppComponent,
  CheckboxAppComponent,
  RadioAppComponent,
  SelectAppComponent,
];

export {
  CommonModule,
  CommonExampleConfigs,
  CommonExampleComponents,
  InputAppModule,
  TextareaAppModule,
  CheckboxAppModule,
  RadioAppModule,
  SelectAppModule,
};
