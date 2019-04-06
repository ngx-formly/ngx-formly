import { AppModule as SelectAppModule } from './app.module';
import { AppComponent as SelectAppComponent } from './app.component';
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
} from '../common';

const select = {
  title: 'Select type',
  component: SelectAppComponent,
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

const NzCompareWithFieldConfig: FormlyFieldConfig = {
  key: 'compareWith',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzCompareWith Function',
    disabled: true,
    placeholder: 'Accept a compare function',
  },
};

const NzAutoClearSearchValueFieldConfig: FormlyFieldConfig = {
  key: 'nzAutoClearSearchValue',
  type: 'checkbox',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzAutoClearSearchValue',
  },
};

const NzOpenFieldConfig: FormlyFieldConfig = {
  key: 'nzOpen',
  type: 'checkbox',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzOpen',
  },
};

const NzDropdownClassNameFieldConfig: FormlyFieldConfig = {
  key: 'nzDropdownClassName',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzDropdownClassName',
  },
};

const NzDropdownMatchSelectWidthFieldConfig: FormlyFieldConfig = {
  key: 'nzDropdownMatchSelectWidth',
  type: 'checkbox',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzDropdownMatchSelectWidth',
  },
};

const NzDropdownStyleFieldConfig: FormlyFieldConfig = {
  key: 'nzDropdownStyle',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzDropdownStyle',
    placeholder: 'Accept a object',
    disabled: true,
  },
};

const NzServerSearchFieldConfig: FormlyFieldConfig = {
  key: 'nzServerSearch',
  type: 'checkbox',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzServerSearch',
  },
};

const NzFilterOptionFieldConfig: FormlyFieldConfig = {
  key: 'nzFilterOption',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzFilterOption',
  },
};

const NzMaxMultipleCountFieldConfig: FormlyFieldConfig = {
  key: 'nzMaxMultipleCount',
  type: 'input-number',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzMaxMultipleCount',
  },
};

const NzModeFieldConfig: FormlyFieldConfig = {
  key: 'nzMode',
  type: 'select',
  className: 'col-md-4',
  defaultValue: 'default',
  templateOptions: {
    label: 'nzMode',
    options: [
      { value: 'default', label: 'default' },
      { value: 'multiple', label: 'multiple' },
      { value: 'tags', label: 'tags' },
    ],
  },
};

const TemplateRefTip = 'Accept TemplateRef<any>';

const NzSuffixIconFieldConfig: FormlyFieldConfig = {
  key: 'nzSuffixIcon',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzSuffixIcon',
    disabled: true,
    placeholder: TemplateRefTip,
  },
};

const NzRemoveIconFieldConfig: FormlyFieldConfig = {
  key: 'nzRemoveIcon',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzRemoveIcon',
    disabled: true,
    placeholder: TemplateRefTip,
  },
};

const NzClearIconFieldConfig: FormlyFieldConfig = {
  key: 'nzClearIcon',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzClearIcon',
    disabled: true,
    placeholder: TemplateRefTip,
  },
};

const NzMenuItemSelectedIconFieldConfig: FormlyFieldConfig = {
  key: 'nzMenuItemSelectedIcon',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzMenuItemSelectedIcon',
    disabled: true,
    placeholder: TemplateRefTip,
  },
};

const NzTokenSeparatorsFieldConfig: FormlyFieldConfig = {
  key: 'nzTokenSeparators',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzTokenSeparators',
    placeholder: 'Available at multiple or tags mode',
  },
  expressionProperties: {
    'templateOptions.disabled': 'model.nzMode === "default"',
  },
};

const NzLoadingFieldConfig: FormlyFieldConfig = {
  key: 'nzLoading',
  type: 'checkbox',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzLoading',
  },
};

const NzMaxTagCountFieldConfig: FormlyFieldConfig = {
  key: 'nzMaxTagCount',
  type: 'input-number',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzMaxTagCount',
    nzMin: 0,
  },
};

const NzMaxTagPlaceholderFieldConfig: FormlyFieldConfig = {
  key: 'nzMaxTagPlaceholder',
  type: 'input',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzMaxTagPlaceholder',
    disabled: true,
    placeholder: TemplateRefTip,
  },
};

const NzCustomContentFieldConfig: FormlyFieldConfig = {
  key: 'nzCustomContent',
  type: 'checkbox',
  className: 'col-md-4',
  templateOptions: {
    label: 'nzCustomContent',
  },
};
const SelectExampleConfig: NzDebugConfig = {
  debugFields: [
    ...debugFields,
    {
      key: 'templateOptions',
      fieldGroupClassName: 'row',
      fieldGroup: [
        NzCompareWithFieldConfig,
        NzAutoClearSearchValueFieldConfig,
        NzAllowClearFieldConfig,
        NzOpenFieldConfig,
        NzAutoFocusFieldConfig,
        NzDisabledFieldConfig,
        NzDropdownClassNameFieldConfig,
        NzDropdownMatchSelectWidthFieldConfig,
        NzDropdownStyleFieldConfig,
        NzServerSearchFieldConfig,
        NzFilterOptionFieldConfig,
        NzMaxMultipleCountFieldConfig,
        NzModeFieldConfig,
        NzNotFoundContentFieldConfig,
        NzPlaceHolderFieldConfig,
        NzShowArrowFieldConfig,
        NzShowSearchFieldConfig,
        NzSizeFieldConfig,
        NzSuffixIconFieldConfig,
        NzRemoveIconFieldConfig,
        NzClearIconFieldConfig,
        NzMenuItemSelectedIconFieldConfig,
        NzTokenSeparatorsFieldConfig,
        NzLoadingFieldConfig,
        NzMaxTagCountFieldConfig,
        NzMaxTagPlaceholderFieldConfig,
        NzCustomContentFieldConfig,
      ],
    },
  ],
  exampleConfig: select,
};

export { SelectAppModule, SelectAppComponent, SelectExampleConfig };
