import { FormlyFieldConfig } from '@ngx-formly/core';
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

const debugFields: FormlyFieldConfig[] = [
  {
    key: 'props',
    fieldGroupClassName: 'row',
    fieldGroup: [
      {
        key: 'label',
        type: 'input',
        className: 'col-md-6',
        props: { label: 'label' },
      },
      {
        key: 'hideLabel',
        className: 'col-md-6',
        type: 'checkbox',
        props: { label: 'hideLabel' },
      },
      {
        key: 'disabled',
        className: 'col-md-6',
        type: 'checkbox',
        props: { label: 'disabled' },
      },
      {
        key: 'required',
        className: 'col-md-6',
        type: 'checkbox',
        props: { label: 'required' },
      },
      {
        key: 'hideRequiredMarker',
        className: 'col-md-6',
        type: 'checkbox',
        props: { label: 'hideRequiredMarker' },
      },
      {
        key: 'description',
        className: 'col-md-6',
        type: 'input',
        props: { label: 'description' },
      },
    ],
  },
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
  debugFields,
};
