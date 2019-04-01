import { AppModule as InputNumberAppModule } from './app.module';
import { AppComponent as InputNumberAppComponent } from './app.component';

import {
  debugFields,
  NzSizeFieldConfig,
  NzDebugConfig,
  NzAutoFocusFieldConfig,
  NzDisabledFieldConfig,
  NzPlaceHolderFieldConfig,
} from '../common';
import { FormlyFieldConfig } from '@ngx-formly/core';

const input = {
  title: 'Input number type',
  component: InputNumberAppComponent,
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

const NzMaxFieldConfig: FormlyFieldConfig = {
  key: 'nzMax',
  type: 'input-number',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzMax',
  },
};

const NzMinFieldConfig: FormlyFieldConfig = {
  key: 'nzMin',
  type: 'input-number',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzMin',
  },
};

const NzFormatterFieldConfig: FormlyFieldConfig = {
  key: 'nzFormatter',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzFormatter',
    disabled: true,
    placeholder: 'Accept a function',
  },
};

const NzParserFieldConfig: FormlyFieldConfig = {
  key: 'nzParser',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzParser',
    disabled: true,
    placeholder: 'Accept a function',
  },
};

const NzPrecisionFieldConfig: FormlyFieldConfig = {
  key: 'nzPrecision',
  type: 'input-number',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzPrecision',
    nzMin: 0,
    nzMax: 10,
  },
};

const NzStepFieldConfig: FormlyFieldConfig = {
  key: 'nzStep',
  type: 'input-number',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzStep',
    nzMin: 0,
  },
};

const InputNumberExampleConfig: NzDebugConfig = {
  debugFields: [
    ...debugFields,
    {
      key: 'templateOptions',
      fieldGroupClassName: 'row',
      fieldGroup: [
        NzAutoFocusFieldConfig,
        NzDisabledFieldConfig,
        NzMaxFieldConfig,
        NzMinFieldConfig,
        NzFormatterFieldConfig,
        NzParserFieldConfig,
        NzPrecisionFieldConfig,
        NzSizeFieldConfig,
        NzStepFieldConfig,
        NzPlaceHolderFieldConfig,
      ],
    },
  ],
  exampleConfig: input,
};

export { InputNumberAppModule, InputNumberAppComponent, InputNumberExampleConfig };
