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
    key: 'templateOptions',
    fieldGroupClassName: 'row',
    fieldGroup: [
      {
        key: 'label',
        type: 'input',
        className: 'col-md-6',
        templateOptions: { label: 'label' },
      },
      {
        key: 'hideLabel',
        className: 'col-md-6',
        type: 'checkbox',
        templateOptions: { label: 'hideLabel' },
      },
      {
        key: 'disabled',
        className: 'col-md-6',
        type: 'checkbox',
        templateOptions: { label: 'disabled' },
      },
      {
        key: 'required',
        className: 'col-md-6',
        type: 'checkbox',
        templateOptions: { label: 'required' },
      },
      {
        key: 'hideRequiredMarker',
        className: 'col-md-6',
        type: 'checkbox',
        templateOptions: { label: 'hideRequiredMarker' },
      },
      {
        key: 'description',
        className: 'col-md-6',
        type: 'input',
        templateOptions: { label: 'description' },
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
