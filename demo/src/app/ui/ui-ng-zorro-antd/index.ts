import { InputAppComponent, InputExampleConfig, InputAppModule } from './input';
import { TextareaAppComponent, TextareaExampleConfig, TextareaAppModule } from './textarea';
import { InputNumberAppComponent, InputNumberExampleConfig, InputNumberAppModule } from './input-number';
import { CheckboxAppComponent, CheckboxAppModule, CheckboxExampleConfig } from './checkbox';
import { RadioAppComponent, RadioAppModule, RadioExampleConfig } from './radio';
import { SelectAppComponent, SelectAppModule, SelectExampleConfig } from './select';

export const NG_ZORRO_COMPONENTS = [
  InputAppComponent,
  TextareaAppComponent,
  InputNumberAppComponent,
  CheckboxAppComponent,
  RadioAppComponent,
  SelectAppComponent,
];

export const NG_ZORRO_EXAMPLE_CONFIGS = [
  InputExampleConfig,
  TextareaExampleConfig,
  InputNumberExampleConfig,
  CheckboxExampleConfig,
  RadioExampleConfig,
  SelectExampleConfig,
];

export const NG_ZORRO_EXAMPLE_MODULE = [
  InputAppModule,
  TextareaAppModule,
  InputNumberAppModule,
  CheckboxAppModule,
  RadioAppModule,
  SelectAppModule,
];
