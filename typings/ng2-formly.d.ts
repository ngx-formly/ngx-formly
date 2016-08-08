import {Validators} from "@angular/forms";

interface IFormlyTemplateOptions {
  type?: string;
  label?: string;
  placeholder?: string;
}
interface IFormlyFields {
  key?: string;
  className?: string;
  fieldGroup?: Array<IFormlyFields>;
  type?: string;
  templateOptions?: IFormlyTemplateOptions;
  validation?: Validators;
  template?: string;
  expressionProperties?: Object;
}
