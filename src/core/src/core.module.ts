import { NgModule, ModuleWithProviders, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyForm } from './components/formly.form';
import { FormlyField } from './components/formly.field';
import { FormlyAttributes } from './components/formly.attributes';
import { FormlyConfig, ConfigOption, FORMLY_CONFIG_TOKEN } from './services/formly.config';
import { FormlyFormBuilder } from './services/formly.form.builder';
import { FormlyGroup } from './components/formly.group';

const FORMLY_DIRECTIVES = [FormlyForm, FormlyField, FormlyAttributes, FormlyGroup];

@NgModule({
  declarations: FORMLY_DIRECTIVES,
  entryComponents: [FormlyGroup],
  exports: FORMLY_DIRECTIVES,
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
        FormlyFormBuilder,
        FormlyConfig,
        { provide: FORMLY_CONFIG_TOKEN, useValue: config, multi: true },
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: config, multi: true },
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
}
