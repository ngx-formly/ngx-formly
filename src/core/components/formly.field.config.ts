export interface FormlyFieldConfig {
  key?: string;
  id?: string;
  templateOptions?: FormlyTemplateOptions;
  validation?: any;
  validators?: any;
  asyncValidaors?: any;
  template?: string;
  wrappers?: string[];
  fieldGroup?: Array<FormlyFieldConfig>;
  fieldArray?: FormlyFieldConfig;
  hideExpression?: boolean | string | (() => boolean);
  className?: string;
  type?: string;
  expressionProperties?: any;
  focus?: boolean | Function;
  blur?: Function;
  keyup?: Function;
  keydown?: Function;
  click?: Function;
  change?: Function;
  keypress?: Function;
  modelOptions?: any;
  lifecycle?: FormlyLifeCycleOptions;
  defaultValue?: any;
  parsers?: [(value: any, index: number) => {}];
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
  max?: number;
  min?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  required?: Boolean;
  tabindex?: number;
  step?: number;
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
