import {FormlyFieldInput} from "./formlyfield.input";
import {FormlyFieldCheckbox} from "./formlyfield.checkbox";
import {FormlyFieldRadio} from "./formlyfield.radio";
import {FormlyFieldSelect} from "./formlyfield.select";
import {FormlyFieldTextArea} from "./formlyfield.textarea";

export const TemplateDirectives = {
    input: FormlyFieldInput,
    checkbox: FormlyFieldCheckbox,
    radio: FormlyFieldRadio,
    select: FormlyFieldSelect,
    textarea: FormlyFieldTextArea
};