export interface FormlyFieldConfig {
  key?: string;
  id?: string;
  templateOptions?: FormlyTemplateOptions;
  validation?: any;
  validators?: any;
  template?: string;
  fieldGroup?: Array<FormlyFieldConfig>;
  hideExpression?: boolean | string | (() => boolean);
  className?: string;
  type?: string;
  expressionProperties?: any;
  focus?: boolean;
  modelOptions?: any;
  lifecycle?: FormlyLifeCycleOptions;
  defaultValue?: any;
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
  hidden?: boolean;
  [additionalProperties: string]: any;
}

export interface FormlyLifeCycleOptions {
  onInit?: Function;
  onChanges?: Function;
  doCheck?: Function;
  afterContentInit?: Function;
  afterContentChecked?: Function;
  afterViewInit?: Function;
  afterViewChecked?: Function;
  onDestroy?: Function;
}
