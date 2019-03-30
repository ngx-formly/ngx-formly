import { AppComponent as TextareaAppComponent, NzAutosizeValue } from './app.component';
import { AppModule as TextareaAppModule } from './app.module';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { debugFields } from '../../common';
import { NzDebugConfig, NzSizeFieldConfig } from '../common';

const textarea = {
  title: 'Textarea type',
  component: TextareaAppComponent,
  debug: true,
  files: [
    { file: 'app.component.html', content: require('!!highlight-loader?raw=true&lang=html!./app.component.html'), filecontent: require('!!raw-loader!./app.component.html') },
    { file: 'app.component.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader!./app.component.ts') },
    { file: 'app.module.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./app.module.ts'), filecontent: require('!!raw-loader!./app.module.ts') },
  ],
};

const NzAutosizeFieldConfig: FormlyFieldConfig[] = [
  {
    key: 'nzAutosize',
    type: 'radio',
    className: 'col-md-4',
    defaultValue: NzAutosizeValue.false,
    templateOptions: {
      label: 'nzAutosize',
      options: [{ value: NzAutosizeValue.false, label: 'false' }, { value: NzAutosizeValue.true, label: 'true' }, { value: NzAutosizeValue.useObject, label: 'config' }],
    },
  },
  {
    key: 'nzAutosizeMaxRows',
    type: 'input',
    className: 'col-md-2',
    templateOptions: {
      label: 'maxRows',
      type: 'number',
      min: 1,
    },
    hideExpression: 'model.nzAutosize !== 2',
  },
  {
    key: 'nzAutosizeMinRows',
    type: 'input',
    className: 'col-md-2',
    templateOptions: {
      label: 'minRows',
      type: 'number',
      min: 1,
    },
    hideExpression: 'model.nzAutosize !== 2',
  },
];

const TextareaExampleConfig: NzDebugConfig = {
  debugFields: [
    ...debugFields,
    { key: 'templateOptions', fieldGroupClassName: 'row', fieldGroup: [NzSizeFieldConfig, ...NzAutosizeFieldConfig] },
  ],
  exampleConfig: textarea,
};

export { TextareaAppModule, TextareaAppComponent, TextareaExampleConfig };
