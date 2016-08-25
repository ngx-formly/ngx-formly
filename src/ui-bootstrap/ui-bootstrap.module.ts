import {NgModule, Injectable} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {FormlyModule, FormlyConfig, FormlyMessages} from "../core/index";
import {FORMLY_TYPES} from "./types/index";

@Injectable()
export class FormlyBootstrap {
  constructor(fc: FormlyConfig, fm: FormlyMessages) {
    fm.addStringMessage("required", "This field is required.");
    fm.addStringMessage("invalidEmailAddress", "Invalid Email Address");
    fm.addStringMessage("maxlength", "Maximum Length Exceeded.");
    fm.addStringMessage("minlength", "Should have atleast 2 Characters");

    FORMLY_TYPES.map(type => fc.setType(type));
  }
}

@NgModule({
  declarations: FORMLY_TYPES.map(type => type.component),
  entryComponents: FORMLY_TYPES.map(type => type.component),
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
