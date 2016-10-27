import { NgModule, ModuleWithProviders, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyForm } from './components/formly.form';
import { FormlyFieldConfig } from './components/formly.field.config';
import { FormlyField } from './components/formly.field';
import { FormlyNgFocus } from './components/formly.field.focus';
import { FormlyConfig, ConfigOption, FORMLY_CONFIG_TOKEN } from './services/formly.config';
import { FormlyMessage, FormlyMessages } from './services/formly.messages';
import { FormlyPubSub, FormlyEventEmitter } from './services/formly.event.emitter';
import { FormlyFieldVisibilityDelegate } from './services/formly.field.delegates';

export {
  FormlyField,
  FormlyFieldConfig,
  FormlyForm,
  FormlyConfig,
  FormlyPubSub,
  FormlyMessage,
  FormlyMessages,
  FormlyFieldVisibilityDelegate,
  FormlyEventEmitter,
};

const FORMLY_DIRECTIVES = [FormlyForm, FormlyField, FormlyMessage, FormlyNgFocus];

@NgModule({
  declarations: FORMLY_DIRECTIVES,
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
        FormlyConfig,
        FormlyPubSub,
        FormlyMessages,
        { provide: FORMLY_CONFIG_TOKEN, useValue: config, multi: true },
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: config, multi: true },
      ],
    };
  }
}
