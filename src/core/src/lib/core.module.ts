import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegacyFormlyForm } from './components/formly.form';
import { LegacyFormlyField } from './components/formly.field';
import { LegacyFormlyAttributes } from './templates/formly.attributes';
import { FormlyConfig } from './services/formly.config';
import { FormlyFormBuilder } from './services/formly.builder';
import { FormlyGroup } from './templates/formly.group';
import { LegacyFormlyValidationMessage } from './templates/formly.validation-message';
import { FormlyTemplateType } from './templates/field-template.type';
import { ConfigOption } from './models';
import { LegacyFormlyTemplate } from './components/formly.template';
import { FORMLY_CONFIG, provideFormlyConfig, withDefaultConfig } from './core.config';

/**
 * Registers Formly components and configuration for NgModule-based applications.
 *
 * `forRoot()` provides the shared `FormlyConfig` at the application root, while
 * `forChild()` adds feature configuration using the inherited service. This follows
 * Angular's [root/child module registration convention](https://frontendatlas.com/angular/trivia/angular-forroot-forchild).
 */
@NgModule({
  declarations: [
    LegacyFormlyTemplate,
    LegacyFormlyForm,
    LegacyFormlyField,
    LegacyFormlyAttributes,
    LegacyFormlyValidationMessage,
    FormlyGroup,
    FormlyTemplateType,
  ],
  exports: [
    LegacyFormlyTemplate,
    LegacyFormlyForm,
    LegacyFormlyField,
    LegacyFormlyAttributes,
    LegacyFormlyValidationMessage,
    FormlyGroup,
  ],
  imports: [CommonModule],
})
export class FormlyModule {
  static forRoot(config: ConfigOption = {}): ModuleWithProviders<FormlyModule> {
    return {
      ngModule: FormlyModule,
      providers: [
        { provide: FORMLY_CONFIG, multi: true, useFactory: withDefaultConfig, deps: [FormlyConfig] },
        provideFormlyConfig(config),
        FormlyConfig,
        FormlyFormBuilder,
      ],
    };
  }

  static forChild(config: ConfigOption = {}): ModuleWithProviders<FormlyModule> {
    return {
      ngModule: FormlyModule,
      providers: [
        { provide: FORMLY_CONFIG, multi: true, useFactory: withDefaultConfig, deps: [FormlyConfig] },
        provideFormlyConfig(config),
        FormlyFormBuilder,
      ],
    };
  }
}
