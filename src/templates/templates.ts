import {FormlyFieldInput} from "./formlyfield.input";
import {FormlyFieldCheckbox} from "./formlyfield.checkbox";
import {FormlyFieldRadio} from "./formlyfield.radio";
import {FormlyFieldSelect} from "./formlyfield.select";
import {FormlyFieldTextArea} from "./formlyfield.textarea";
import {FormlyFieldMultiCheckbox} from "./formlyfield.multicheckbox";
import {TypeOption} from "../services/formly.config";

export const TemplateDirectives: [TypeOption] = [
  {
    name: "input",
    component: FormlyFieldInput
  },
  {
    name: "checkbox",
    component: FormlyFieldCheckbox,
  },
  {
    name: "radio",
    component: FormlyFieldRadio,
  },
  {
    name: "select",
    component: FormlyFieldSelect,
  },
  {
    name: "textarea",
    component: FormlyFieldTextArea,
  },
  {
    name: "multicheckbox",
    component: FormlyFieldMultiCheckbox
  }
];
