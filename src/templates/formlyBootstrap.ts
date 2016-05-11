import {FormlyConfig} from "../services/formly.config";
import {FormlyMessages} from "../services/formly.messages";
import {TemplateDirectives} from "./templates";
import {Injectable} from "angular2/core";

@Injectable()
export class FormlyBootstrap {
  constructor(fc: FormlyConfig, fm: FormlyMessages) {
    fm.addStringMessage("required", "This field is required.");
    fm.addStringMessage("invalidEmailAddress", "Invalid Email Address");
    fm.addStringMessage("maxlength", "Maximum Length Exceeded.");
    fm.addStringMessage("minlength", "Should have atleast 2 Characters");

    ["input", "checkbox", "radio", "select"].forEach(function (field) {
      fc.setType({
        name: field,
        component: TemplateDirectives[field]
      });
    });
  }
}
