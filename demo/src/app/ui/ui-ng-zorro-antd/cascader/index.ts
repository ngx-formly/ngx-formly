import { AppModule as CascaderAppModule } from './app.module';
import { AppComponent as CascaderAppComponent } from './app.component';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  NzDebugConfig,
  NzAutoFocusFieldConfig,
  NzDisabledFieldConfig,
  NzSizeFieldConfig,
  NzPlaceHolderFieldConfig,
  debugFields,
  NzAllowClearFieldConfig,
  NzNotFoundContentFieldConfig,
  NzShowArrowFieldConfig,
  NzShowSearchFieldConfig,
  NzShowInputFieldConfig,
} from '../common';

const cascader = {
  title: 'Cascader type',
  component: CascaderAppComponent,
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

const NzChangeOnFieldConfig: FormlyFieldConfig = {
  key: 'nzChangeOn',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzChangeOn Function',
    disabled: true,
    placeholder: 'Accept a function',
  },
};

const NzChangeOnSelectFiledConfig: FormlyFieldConfig = {
  key: 'nzChangeOnSelect',
  type: 'checkbox',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzChangeOnSelect',
  },
};

const NzColumnClassNameFieldConfig: FormlyFieldConfig = {
  key: 'nzColumnClassName',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzColumnClassName',
  },
};

const NzExpandTriggerFieldConfig: FormlyFieldConfig = {
  key: 'nzExpandTrigger',
  type: 'select',
  className: 'col-md-4',
  defaultValue: 'click',
  templateOptions: {
    label: 'nzExpandTrigger',
    options: [{ value: 'click', name: 'click' }, { value: 'hover', name: 'hover' }],
  },
};

const NzMenuClassNameFieldConfig: FormlyFieldConfig = {
  key: 'nzMenuClassName',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzMenuClassName',
  },
};

const NzMenuStyleFieldConfig: FormlyFieldConfig = {
  key: 'nzMenuStyle',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzMenuStyle',
    placeholder: 'Accept a object',
    disabled: true,
  },
};

const NzLabelPropertyFieldConfig: FormlyFieldConfig = {
  key: 'nzLabelProperty',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzLabelProperty',
    disabled: true,
    placeholder: 'This value can not be changed',
  },
};

const NzLabelRenderFieldConfig: FormlyFieldConfig = {
  key: 'nzLabelRender',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzLabelRender',
    disabled: true,
    placeholder: 'Accept TemplateRef<any>',
  },
};

const NzLoadDataFieldConfig: FormlyFieldConfig = {
  key: 'nzLoadData',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzLoadData',
    disabled: true,
    placeholder: 'Accept a function',
  },
};

const NzOptionsFieldConfig: FormlyFieldConfig = {
  key: 'nzOptionsKey',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzOptions',
    disabled: true,
    placeholder: 'Accept data type: object[]',
  },
};

const NzValuePropertyFieldConfig: FormlyFieldConfig = {
  key: 'nzValueProperty',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzValueProperty',
    disabled: true,
    placeholder: 'This value can not be changed',
  },
};

const CascaderExampleConfig: NzDebugConfig = {
  debugFields: [
    ...debugFields,
    {
      key: 'templateOptions',
      fieldGroupClassName: 'row',
      fieldGroup: [
        NzAllowClearFieldConfig,
        NzAutoFocusFieldConfig,
        NzChangeOnFieldConfig,
        NzChangeOnSelectFiledConfig,
        NzColumnClassNameFieldConfig,
        NzDisabledFieldConfig,
        NzExpandTriggerFieldConfig,
        NzMenuClassNameFieldConfig,
        NzMenuStyleFieldConfig,
        NzNotFoundContentFieldConfig,
        NzPlaceHolderFieldConfig,
        NzLabelPropertyFieldConfig,
        NzLabelRenderFieldConfig,
        NzLoadDataFieldConfig,
        NzOptionsFieldConfig,
        NzShowArrowFieldConfig,
        NzShowInputFieldConfig,
        NzShowSearchFieldConfig,
        NzSizeFieldConfig,
        NzValuePropertyFieldConfig,
      ],
    },
  ],
  exampleConfig: cascader,
};

export { CascaderAppModule, CascaderAppComponent, CascaderExampleConfig };
