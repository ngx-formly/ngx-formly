import { FormlyFieldConfig } from '@ngx-formly/core';
import { InputAppComponent, InputExampleConfig } from '../common/input';
import { TextareaAppComponent, TextareaExampleConfig } from '../common/textarea';
import { CheckboxAppComponent, CheckboxExampleConfig } from '../common/checkbox';
import { RadioAppComponent, RadioExampleConfig } from '../common/radio';
import { SelectAppComponent, SelectExampleConfig } from '../common/select';

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

export { CommonExampleConfigs, CommonExampleComponents, debugFields };
