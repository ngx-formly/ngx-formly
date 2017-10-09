import { FormGroup, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Field } from './../templates/field';

export interface FormlyFieldConfig {
  key?: string;
  id?: string;
  name?: string;
  templateOptions?: FormlyTemplateOptions;
  optionsTypes?: string[];
  validation?: {
    messages?: {
      [messageProperties: string]: string | Function;
    };
    show?: boolean;
    [additionalProperties: string]: any;
  };
  validators?: any;
  asyncValidators?: any;
  template?: string;
  component?: any;
  wrapper?: string[] | string;
  wrappers?: string[];
  fieldGroupClassName?: string;
  fieldGroup?: Array<FormlyFieldConfig>;
  fieldArray?: FormlyFieldConfig;
  hide?: boolean;
  formControl?: AbstractControl;
  hideExpression?: boolean | string | ((model: any, formState: any) => boolean);
  className?: string;
  type?: string;
  expressionProperties?: any;
  focus?: boolean;
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
  hidden?: boolean;
  max?: number;
  min?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  required?: Boolean;
  tabindex?: number;
  step?: number;
  focus?: Function;
  blur?: Function;
  keyup?: Function;
  keydown?: Function;
  click?: Function;
  change?: Function;
  keypress?: Function;
  [additionalProperties: string]: any;
}

export interface FormlyLifeCycleFn {
    (form?: FormGroup, field?: FormlyFieldConfig, model?: any, options?: any): void;
}

export interface FormlyLifeCycleOptions {
  onInit?: FormlyLifeCycleFn;
  onChanges?: FormlyLifeCycleFn;
  doCheck?: FormlyLifeCycleFn;
  afterContentInit?: FormlyLifeCycleFn;
  afterContentChecked?: FormlyLifeCycleFn;
  afterViewInit?: FormlyLifeCycleFn;
  afterViewChecked?: FormlyLifeCycleFn;
  onDestroy?: FormlyLifeCycleFn;
}

export interface FormlyOptions {
  updateInitialValue?: () => void;
  resetModel?: (model?: any) => void;
  formState?: any;
  fieldChanges?: Subject<FormlyValueChangeEvent>;
  fieldTransform?: any;
  showError?: (field: Field) => boolean;
}

export interface FormlyValueChangeEvent {
  field: FormlyFieldConfig;
  type: string;
  value: any;
}

