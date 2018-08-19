import { NgModule, ModuleWithProviders, ANALYZE_FOR_ENTRY_COMPONENTS, Inject, Optional, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyForm } from './components/formly.form';
import { FormlyField } from './components/formly.field';
import { FormlyAttributes } from './components/formly.attributes';
import { FormlyConfig, ConfigOption, FORMLY_CONFIG } from './services/formly.config';
import { FormlyFormBuilder } from './services/formly.form.builder';
import { FormlyGroup } from './components/formly.group';
import { FormlyValidationMessage } from './templates/formly.validation-message';
import { FieldExpressionExtension } from './extensions/field-expression/field-expression';

export function defaultFormlyConfig(): ConfigOption {
  return {
    types: [{ name: 'formly-group', component: FormlyGroup }],
    extensions: [{ name: 'field-expression', extension: new FieldExpressionExtension() }],
  };
}

@NgModule({
  declarations: [FormlyForm, FormlyField, FormlyAttributes, FormlyGroup, FormlyValidationMessage],
  entryComponents: [FormlyGroup],
  exports: [FormlyForm, FormlyField, FormlyAttributes, FormlyGroup, FormlyValidationMessage],
  imports: [CommonModule],
})
export class FormlyModule {
  static forRoot(config: ConfigOption = {}): ModuleWithProviders {
    return {
      ngModule: FormlyModule,
      providers: [
        { provide: FORMLY_CONFIG, multi: true, useFactory: defaultFormlyConfig },
        { provide: FORMLY_CONFIG, useValue: config, multi: true },
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
        { provide: FORMLY_CONFIG, useValue: config, multi: true },
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: config, multi: true },
      ],
    };
  }

  constructor(
    configService: FormlyConfig,
    componentFactoryResolver: ComponentFactoryResolver,
    @Optional() @Inject(FORMLY_CONFIG) configs: ConfigOption[] = [],
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
