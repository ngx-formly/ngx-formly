import { AppComponent as RadioAppComponent } from './app.component';
import { AppModule as RadioAppModule } from './app.module';

import { FormlyFieldConfig } from '@ngx-formly/core';

import {
  debugFields,
  NzDebugConfig,
  NzAutoFocusFieldConfig,
  NzDisabledFieldConfig,
  NzValueFieldConfig as CommonNzValueConfig,
  NzNameFieldConfig,
  NzSizeFieldConfig,
} from '../common';

const radio = {
  title: 'Radio type',
  component: RadioAppComponent,
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

const NzButtonStyleFieldConfig: FormlyFieldConfig = {
  key: 'nzButtonStyle',
  type: 'select',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzButtonStyle',
    options: [{ value: 'outline', label: 'outline' }, { value: 'solid', label: 'solid' }],
    nzPlaceHolder: 'Radio button',
  },
};

const NzValueFieldConfig: FormlyFieldConfig = {
  ...CommonNzValueConfig,
  type: 'input-number',
  templateOptions: {
    ...CommonNzValueConfig.templateOptions,
    nzMin: 1,
    nzMax: 4,
  },
};

const RadioExampleConfig: NzDebugConfig = {
  debugFields: [
    ...debugFields,
    {
      key: 'templateOptions',
      fieldGroupClassName: 'row',
      fieldGroup: [
        NzAutoFocusFieldConfig,
        NzDisabledFieldConfig,
        NzValueFieldConfig,
        NzNameFieldConfig,
        NzButtonStyleFieldConfig,
        { ...NzSizeFieldConfig, hideExpression: '!model.nzButtonStyle' },
      ],
    },
  ],
  exampleConfig: radio,
};

export { RadioAppModule, RadioAppComponent, RadioExampleConfig };
