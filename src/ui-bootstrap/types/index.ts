import {FormlyFieldInput} from "./input";
import {FormlyFieldCheckbox} from "./checkbox";
import {FormlyFieldRadio} from "./radio";
import {FormlyFieldSelect} from "./select";
import {FormlyFieldTextArea} from "./textarea";
import {FormlyFieldMultiCheckbox} from "./multicheckbox";
import {TypeOption} from "../../core/index";

export const FORMLY_TYPES: [TypeOption] = [
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
