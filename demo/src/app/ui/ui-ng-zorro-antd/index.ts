import { InputAppComponent, InputExampleConfig, InputAppModule } from './input';
import { TextareaAppComponent, TextareaExampleConfig, TextareaAppModule } from './textarea';
import { InputNumberAppComponent, InputNumberExampleConfig, InputNumberAppModule } from './input-number';
import { CheckboxAppComponent, CheckboxAppModule, CheckboxExampleConfig } from './checkbox';
import { RadioAppComponent, RadioAppModule, RadioExampleConfig } from './radio';
import { SelectAppComponent, SelectAppModule, SelectExampleConfig } from './select';
import { CascaderExampleConfig, CascaderAppComponent, CascaderAppModule } from './cascader';

export const NG_ZORRO_COMPONENTS = [
  CascaderAppComponent,
  InputAppComponent,
  TextareaAppComponent,
  InputNumberAppComponent,
  CheckboxAppComponent,
  RadioAppComponent,
  SelectAppComponent,
];

export const NG_ZORRO_EXAMPLE_CONFIGS = [
  CascaderExampleConfig,
  InputExampleConfig,
  TextareaExampleConfig,
  InputNumberExampleConfig,
  CheckboxExampleConfig,
  RadioExampleConfig,
  SelectExampleConfig,
];

export const NG_ZORRO_EXAMPLE_MODULE = [
  CascaderAppModule,
  InputAppModule,
  TextareaAppModule,
  InputNumberAppModule,
  CheckboxAppModule,
  RadioAppModule,
  SelectAppModule,
];
