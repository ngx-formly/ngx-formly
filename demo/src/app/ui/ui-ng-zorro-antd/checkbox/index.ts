import { AppComponent as CheckboxAppComponent } from './app.component';
import { AppModule as CheckboxAppModule } from './app.module';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { debugFields, NzDebugConfig, NzAutoFocusFieldConfig, NzDisabledFieldConfig } from '../common';

const checkbox = {
  title: 'Checkbox type',
  component: CheckboxAppComponent,
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

const NzIndeterminateFieldConfig: FormlyFieldConfig = {
  key: 'nzIndeterminate',
  type: 'checkbox',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzIndeterminate',
  },
};

const CheckboxExampleConfig: NzDebugConfig = {
  debugFields: [
    ...debugFields,
    {
      key: 'templateOptions',
      fieldGroupClassName: 'row',
      fieldGroup: [NzAutoFocusFieldConfig, NzDisabledFieldConfig, NzIndeterminateFieldConfig],
    },
  ],
  exampleConfig: checkbox,
};

export { CheckboxAppModule, CheckboxAppComponent, CheckboxExampleConfig };
