import { AppModule as InputAppModule } from './app.module';
import { AppComponent as InputAppComponent } from './app.component';

import { debugFields, NzSizeFieldConfig, NzDebugConfig } from '../common';
import { FormlyFieldConfig } from '@ngx-formly/core';

const input = {
  title: 'Input type',
  component: InputAppComponent,
  debug: true,
  files: [
    {
      file: 'app.component.html',
      content: require('!!highlight-loader?raw=true&lang=html!./app.component.html'),
      filecontent: require('!!raw-loader!./app.component.html'),
    },
    {
      file: 'app.component.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!./app.component.ts'),
      filecontent: require('!!raw-loader!./app.component.ts'),
    },
    {
      file: 'app.module.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!./app.module.ts'),
      filecontent: require('!!raw-loader!./app.module.ts'),
    },
  ],
};

const NzAddOnAfterFieldConfig: FormlyFieldConfig = {
  key: 'nzAddOnAfter',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzAddOnAfter',
  },
};

const NzAddOnBeforeFieldConfig: FormlyFieldConfig = {
  key: 'nzAddOnBefore',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzAddOnBefore',
  },
};

const NzPrefixFieldConfig: FormlyFieldConfig = {
  key: 'nzPrefix',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzPrefix',
  },
};

const NzSuffixFieldConfig: FormlyFieldConfig = {
  key: 'nzSuffix',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzSuffix',
  },
};

const NzCompactFieldConfig: FormlyFieldConfig = {
  key: 'nzCompact',
  type: 'checkbox',
  defaultValue: false,
  className: 'col-md-4',
  templateOptions: {
    label: 'nzCompact',
  },
};

const NzSearchFieldConfig: FormlyFieldConfig = {
  key: 'nzSearch',
  type: 'checkbox',
  defaultValue: false,
  className: 'col-md-4',
  templateOptions: {
    label: 'nzSearch',
  },
};

const NzPasswordConfig: FormlyFieldConfig = {
  key: 'passwordModel',
  type: 'checkbox',
  defaultValue: false,
  className: 'col-md-4',
  templateOptions: {
    label: 'passwordModel',
  },
};

const InputExampleConfig: NzDebugConfig = {
  debugFields: [
    ...debugFields,
    {
      key: 'templateOptions',
      fieldGroupClassName: 'row',
      fieldGroup: [
        NzSizeFieldConfig,
        NzAddOnAfterFieldConfig,
        NzAddOnBeforeFieldConfig,
        NzPrefixFieldConfig,
        NzSuffixFieldConfig,
        NzCompactFieldConfig,
        NzSearchFieldConfig,
        NzPasswordConfig,
      ],
    },
  ],
  exampleConfig: input,
};

export { InputAppModule, InputAppComponent, InputExampleConfig };
