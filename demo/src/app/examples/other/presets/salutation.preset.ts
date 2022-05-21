import { Inject, Injectable, InjectionToken } from '@angular/core';
import { ConfigOption, FormlyFieldConfig } from '@ngx-formly/core';

export const SALUTATION_OPTIONS = new InjectionToken<string[]>('SALUTATION_OPTIONS');

@Injectable()
export class SalutationPresetProvider {
  constructor(@Inject(SALUTATION_OPTIONS) private salutationOptions: string[]) {}
  getConfiguration(): FormlyFieldConfig {
    return {
      key: 'salutation',
      type: 'select',
      props: {
        label: 'Salutation',
        placeholder: 'Please Select',
        options: this.salutationOptions.map((salutation) => ({ label: salutation, value: salutation })),
      },
    };
  }
}

export function registerSalutationPreset(salutationOptions: string[]): ConfigOption {
  return {
    presets: [
      {
        name: 'salutation',
        config: new SalutationPresetProvider(salutationOptions),
      },
    ],
  };
}
