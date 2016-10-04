import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {FormlyModule} from "../core";
import {TemplateDirectives, FIELD_TYPE_COMPONENTS} from "./templates";

@NgModule({
  declarations: FIELD_TYPE_COMPONENTS,
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      types: TemplateDirectives,
      validationMessages: [
        {name: "required", message: "This field is required."},
        {name: "invalidEmailAddress", message: "Invalid Email Address"},
        {name: "maxlength", message: "Maximum Length Exceeded."},
        {name: "minlength", message: "Should have atleast 2 Characters"},
      ],
    }),
  ]
})
export class FormlyBootstrapModule {}
