import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {FormlyConfig} from "../services/formly.config";
import {FormlyModule} from "../core";
import {FormlyMessages} from "../services/formly.messages";
import {TemplateDirectives} from "./templates";
import {Injectable} from "@angular/core";

@Injectable()
export class FormlyBootstrap {
  constructor(fc: FormlyConfig, fm: FormlyMessages) {
    fm.addStringMessage("required", "This field is required.");
    fm.addStringMessage("invalidEmailAddress", "Invalid Email Address");
    fm.addStringMessage("maxlength", "Maximum Length Exceeded.");
    fm.addStringMessage("minlength", "Should have atleast 2 Characters");

    TemplateDirectives.map(type => fc.setType(type));
  }
}

@NgModule({
  declarations: TemplateDirectives.map(type => type.component),
  entryComponents: TemplateDirectives.map(type => type.component),
  providers: [
    FormlyBootstrap,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormlyModule,
  ]
})
export class FormlyBootstrapModule {}
