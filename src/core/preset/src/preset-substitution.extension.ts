import { FormlyConfig, FormlyExtension, FormlyFieldConfig, ɵreverseDeepMerge } from '@ngx-formly/core';
export class PresetSubstitutionExtension implements FormlyExtension {
  constructor(private formlyConfig: FormlyConfig) {}

  prePopulate(field: FormlyFieldConfig): void {
    if (!(typeof field.type === 'string') || field.type[0] !== '#') {
      return;
    }
    const configId = new RegExp(/^#(.+)$/).exec(field.type)?.[1];
    const preset = this.formlyConfig.presets[configId];

    const { type: _, ...fieldConfigWithoutType } = field;
    if (preset) {
      const merged = ɵreverseDeepMerge(
        fieldConfigWithoutType,
        'getConfiguration' in preset ? preset.getConfiguration() : preset,
      );
      Object.assign(field, merged);
    }
  }
}

export function registerLibraryConfigReplacementExtension(formlyConfig: FormlyConfig) {
  return {
    extensions: [
      {
        name: 'libraryConfigReplacement',
        extension: new PresetSubstitutionExtension(formlyConfig),
        priority: -300,
      },
    ],
  };
}
