import {FormlyFieldInput} from "./formlyfield.input";
import {FormlyFieldCheckbox} from "./formlyfield.checkbox";
import {FormlyFieldRadio} from "./formlyfield.radio";
import {FormlyFieldSelect} from "./formlyfield.select";
import {FormlyFieldTextArea} from "./formlyfield.textarea";
import {FormlyFieldMultiCheckbox} from "./formlyfield.multicheckbox";

export const TemplateDirectives = {
  input: FormlyFieldInput,
  checkbox: FormlyFieldCheckbox,
  radio: FormlyFieldRadio,
  select: FormlyFieldSelect,
  textarea: FormlyFieldTextArea,
  multicheckbox: FormlyFieldMultiCheckbox
};
