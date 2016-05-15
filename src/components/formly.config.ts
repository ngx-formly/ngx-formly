
export interface FormlyFieldConfig {
  key?: string;
  templateOptions?: FormlyTemplateOptions;
  validation?: any;
  template?: string;
  fieldGroup?: Array<FormlyFieldConfig>;
  hideExpression?: boolean | string | (() => boolean);
  className?: string;
  type?: string;
  expressionProperties?: any;
  focus?: boolean;
}

export interface FormlyTemplateOptions {
  type?: string;
  label?: string;
  placeholder?: string;
  disabled?: Boolean;
  options?: Array<any>;
  rows?: number;
  cols?: number;
  description?: string;
  focus?: boolean;
}
