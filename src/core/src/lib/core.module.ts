import { NgModule, ModuleWithProviders, ANALYZE_FOR_ENTRY_COMPONENTS, Inject, Optional, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyForm } from './components/formly.form';
import { FormlyField } from './components/formly.field';
import { FormlyAttributes } from './components/formly.attributes';
import { FormlyConfig, ConfigOption, FORMLY_CONFIG_TOKEN } from './services/formly.config';
import { FormlyFormBuilder } from './services/formly.form.builder';
import { FormlyGroup } from './components/formly.group';
import { FormlyValidationMessage } from './templates/formly.validation-message';

@NgModule({
  declarations: [FormlyForm, FormlyField, FormlyAttributes, FormlyGroup, FormlyValidationMessage],
  entryComponents: [FormlyGroup],
  exports: [FormlyForm, FormlyField, FormlyAttributes, FormlyGroup, FormlyValidationMessage],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class FormlyModule {
  static forRoot(config: ConfigOption = {}): ModuleWithProviders {
    return {
      ngModule: FormlyModule,
      providers: [
        { provide: FORMLY_CONFIG_TOKEN, useValue: { types: [{ name: 'formly-group', component: FormlyGroup }] }, multi: true },
        { provide: FORMLY_CONFIG_TOKEN, useValue: config, multi: true },
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: config, multi: true },
        FormlyConfig,
        FormlyFormBuilder,
      ],
    };
  }

  static forChild(config: ConfigOption = {}): ModuleWithProviders {
    return {
      ngModule: FormlyModule,
      providers: [
        { provide: FORMLY_CONFIG_TOKEN, useValue: config, multi: true },
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: config, multi: true },
      ],
    };
  }

  constructor(
    configService: FormlyConfig,
    componentFactoryResolver: ComponentFactoryResolver,
    @Optional() @Inject(FORMLY_CONFIG_TOKEN) configs: ConfigOption[] = [],
  ) {
    if (!configs) {
      return;
    }

    configs.forEach(config => {
      [...(config.types || []), ...(config.wrappers || [])]
      .filter(t => !!t)
      .forEach(t => t.componentFactoryResolver = componentFactoryResolver);

      configService.addConfig(config);
    });
  }
}
