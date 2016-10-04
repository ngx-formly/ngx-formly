import {NgModule, ModuleWithProviders, ANALYZE_FOR_ENTRY_COMPONENTS} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {FormlyForm} from "./components/formly.form";
import {FormlyField} from "./components/formly.field";
import {FormlyNgFocus} from "./components/formly.field.focus";
import {FormlyConfig, ConfigOption, FORMLY_CONFIG_TOKEN} from "./services/formly.config";
import {FormlyMessage, FormlyMessages} from "./services/formly.messages";
import {FormlyPubSub} from "./services/formly.event.emitter";

export {FormlyField} from "./components/formly.field";
export {FormlyFieldConfig} from "./components/formly.field.config";
export {FormlyForm} from "./components/formly.form";
export {FormlyConfig} from "./services/formly.config";
export {FormlyPubSub, FormlyEventEmitter} from "./services/formly.event.emitter";
export {FormlyMessage, FormlyMessages} from "./services/formly.messages";
export {FormlyFieldVisibilityDelegate} from "./services/formly.field.delegates";

const FORMLY_DIRECTIVES = [FormlyForm, FormlyField, FormlyMessage, FormlyNgFocus];

@NgModule({
  declarations: FORMLY_DIRECTIVES,
  exports: FORMLY_DIRECTIVES,
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ]
})
export class FormlyModule {
  static forRoot(config: ConfigOption): ModuleWithProviders {
    return {
      ngModule: FormlyModule,
      providers: [
        FormlyConfig,
        FormlyPubSub,
        FormlyMessages,
        { provide: FORMLY_CONFIG_TOKEN, useValue: config, multi: true },
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: config, multi: true }
      ]
    };
  }
}
