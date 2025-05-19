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
import { FormlyTemplate } from './components/formly.template';
import { FORMLY_CONFIG, withDefaultConfig } from './core.config';

@NgModule({
  declarations: [
    FormlyTemplate,
    LegacyFormlyForm,
    LegacyFormlyField,
    LegacyFormlyAttributes,
    LegacyFormlyValidationMessage,
    FormlyGroup,
    FormlyTemplateType,
  ],
  exports: [
    FormlyTemplate,
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
        { provide: FORMLY_CONFIG, useValue: config, multi: true },
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
        { provide: FORMLY_CONFIG, useValue: config, multi: true },
        FormlyFormBuilder,
      ],
    };
  }
}
