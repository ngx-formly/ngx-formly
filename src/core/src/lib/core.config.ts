import { inject, InjectionToken, Provider } from '@angular/core';
import { FieldExpressionExtension } from './extensions/field-expression/field-expression';
import { FieldExpressionExtension as FieldExpressionLegacyExtension } from './extensions/field-expression-legacy/field-expression';
import { CoreExtension } from './extensions/core/core';
import { FieldFormExtension } from './extensions/field-form/field-form';
import { FieldValidationExtension } from './extensions/field-validation/field-validation';
import { FormlyTemplateType } from './templates/field-template.type';
import { FormlyGroup } from './templates/formly.group';
import { ConfigOption } from './models';
import { FormlyConfig } from './services/formly.config';

/**
 * An InjectionToken for registering additional formly config options (types, wrappers ...).
 */
export const FORMLY_CONFIG = new InjectionToken<ConfigOption[]>('FORMLY_CONFIG');

export function withDefaultConfig(config: FormlyConfig): ConfigOption {
  return {
    types: [
      { name: 'formly-group', component: FormlyGroup },
      { name: 'formly-template', component: FormlyTemplateType },
    ],
    extensions: [
      { name: 'core', extension: new CoreExtension(config), priority: -250 },
      { name: 'field-validation', extension: new FieldValidationExtension(config), priority: -200 },
      { name: 'field-form', extension: new FieldFormExtension(), priority: -150 },
      {
        name: 'field-expression',
        extension: new FieldExpressionLegacyExtension(),
        priority: -100,
      },
    ],
  };
}

export function withFormlyFieldExpression(): ConfigOption {
  return {
    extensions: [
      {
        name: 'field-expression',
        extension: new FieldExpressionExtension(),
        priority: -100,
      },
    ],
  };
}

export const provideFormlyCore = (configs: ConfigOption | ConfigOption[] = []): Provider => {
  return [
    { provide: FORMLY_CONFIG, multi: true, useFactory: withDefaultConfig, deps: [FormlyConfig] },
    provideFormlyConfig(configs),
  ];
};

export const provideFormlyConfig = (configs: ConfigOption | ConfigOption[] = []): Provider => {
  return {
    provide: FORMLY_CONFIG,
    multi: true,
    useFactory: () => {
      const currentConfig: Array<ConfigOption | ConfigOption[]> = inject(FORMLY_CONFIG, {
        skipSelf: true,
        optional: true,
      });
      if (currentConfig) {
        currentConfig.push(configs);
        return currentConfig;
      }

      return configs;
    },
  };
};
