import { Injectable } from '@angular/core';
import { ConfigOption, FormlyFieldConfig, FormlyFieldConfigPresetProvider } from '@ngx-formly/core';

@Injectable()
export class GroupPresetProvider implements FormlyFieldConfigPresetProvider {
  constructor() {}
  getConfiguration(field?: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: 'group',
      type: 'formly-group',
      props: { label: 'Group' },
      fieldGroup: [
        {
          key: 'prefix',
          type: 'input',
          props: { label: 'Prefixed Field' },
        },
        ...(field?.fieldGroup ?? []),
      ],
    };
  }
}

export function registerGroupPreset(): ConfigOption {
  return {
    presets: [
      {
        name: 'group',
        config: new GroupPresetProvider(),
      },
    ],
  };
}
