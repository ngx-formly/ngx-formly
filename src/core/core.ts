import { NgModule, ModuleWithProviders, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyForm } from './components/formly.form';
import { FormlyFieldConfig } from './components/formly.field.config';
import { FormlyField } from './components/formly.field';
import { FormlyAttributes } from './components/formly.attributes';
import { FormlyConfig, ConfigOption, FORMLY_CONFIG_TOKEN } from './services/formly.config';
import { FormlyFormBuilder } from './services/formly.form.builder';
import { FormlyValidationMessages } from './services/formly.validation-messages';
import { FormlyPubSub, FormlyEventEmitter } from './services/formly.event.emitter';
import { Field } from './templates/field';
import { FieldType } from './templates/field.type';
import { FieldWrapper } from './templates/field.wrapper';
import { FormlyGroup } from './components/formly.group';

export {
  ConfigOption,
  FormlyAttributes,
  FormlyFormBuilder,
  FormlyField,
  FormlyFieldConfig,
  FormlyForm,
  FormlyConfig,
  FormlyPubSub,
  FormlyValidationMessages,
  FormlyEventEmitter,

  Field,
  FieldType,
  FieldWrapper,
};

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
        FormlyPubSub,
        FormlyValidationMessages,
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
