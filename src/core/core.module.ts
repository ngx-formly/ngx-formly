import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {FormlyForm} from "./components/formly.form";
import {FormlyField} from "./components/formly.field";
import {FormlyConfig} from "./services/formly.config";
import {FormlyMessage, FormlyMessages} from "./services/formly.messages";
import {FormlyProviders} from "./services/formly.providers";

export const FORMLY_DIRECTIVES = [FormlyForm, FormlyField, FormlyMessage];

@NgModule({
  declarations: FORMLY_DIRECTIVES,
  exports: FORMLY_DIRECTIVES,
  providers: [FormlyConfig, FormlyProviders],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ]
})
export class FormlyModule {}
