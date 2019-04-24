import { FormGroup, AbstractControl, FormGroupDirective, FormArray, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { FieldType } from '../templates/field.type';
import { TemplateManipulators } from '../services/formly.config';
import { ComponentFactoryResolver, ComponentRef, Injector } from '@angular/core';

export interface FormlyFieldConfig {
  /**
   * The model that stores all the data, where the model[key] is the value of the field
   */
  readonly model?: any;

  /**
   * The parent field.
   */
  readonly parent?: FormlyFieldConfig;


  readonly options?: FormlyFormOptions;
  readonly form?: FormGroup;

  /**
   * The key that relates to the model. This will link the field value to the model
   */
  key?: string;

  /**
   * This allows you to specify the `id` of your field. Note, the `id` is generated if not set.
   */
  id?: string;

  /**
   * If you wish, you can specify a specific `name` for your field. This is useful if you're posting the form to a server using techniques of yester-year.
   */
  name?: string;

  /**
   * This is reserved for the templates. Any template-specific options go in here. Look at your specific template implementation to know the options required for this.
   */
  templateOptions?: FormlyTemplateOptions;

  optionsTypes?: string[];

  /**
   * An object with a few useful properties
   * - `validation.messages`: A map of message names that will be displayed when the field has errors.
   * - `validation.show`: A boolean you as the developer can set to force displaying errors whatever the state of field. This is useful when you're trying to call the user's attention to some fields for some reason.
   */
  validation?: {
    messages?: {
      [messageProperties: string]: string | ((error: any, field: FormlyFieldConfig) => string);
    };
    show?: boolean;
    [additionalProperties: string]: any;
  };

  /**
   * Used to set validation rules for a particular field.
   * Should be an object of key - value pairs. The value can either be an expression to evaluate or a function to run.
   * Each should return a boolean value, returning true when the field is valid. See Validation for more information.
   *
   * {
   *   validation?: (string | ValidatorFn)[];
   *   [key: string]: ((control: AbstractControl, field: FormlyFieldConfig) => boolean) | ({ expression: (control: AbstractControl, field: FormlyFieldConfig) => boolean, message: string | ((error, field: FormlyFieldConfig) => string) });
   * }
   */
  validators?: any;

  /**
   * Use this one for anything that needs to validate asynchronously.
   * Pretty much exactly the same as the validators api, except it must be a function that returns a promise.
   *
   * {
   *   validation?: (string | AsyncValidatorFn)[];
   *   [key: string]: ((control: AbstractControl, field: FormlyFieldConfig) => Promise<boolean>) | ({ expression: (control: AbstractControl, field: FormlyFieldConfig) => Promise<boolean>, message: string });
   * }
   */
  asyncValidators?: any;

  /**
   * Can be set instead of `type` to render custom html content.
   */
  template?: string;

  /**
   *  It is expected to be the name of the wrappers.
   *  The formly field template will be wrapped by the first wrapper, then the second, then the third, etc.
   *  You can also specify these as part of a type (which is the recommended approach).
   */
  wrappers?: string[];

  /**
   * Whether to hide the field. Defaults to false. If you wish this to be conditional use `hideExpression`
   */
  hide?: boolean;

  /**
   * Conditionally hiding Field based on values from other Fields
   */
  hideExpression?: boolean | string | ((model: any, formState: any, field?: FormlyFieldConfig) => boolean);

  /**
   * An object where the key is a property to be set on the main field config and the value is an expression used to assign that property.
   */
  expressionProperties?: { [property: string]: string | ((model: any, formState: any, field?: FormlyFieldConfig) => any) | Observable<any> };

  /**
   * This is the [FormControl](https://angular.io/api/forms/FormControl) for the field.
   * It provides you more control like running validators, calculating status, and resetting state.
   */
  formControl?: AbstractControl;

  /**
   * You can specify your own class that will be applied to the `formly-field` component.
   */
  className?: string;

  /**
   * Specify your own class that will be applied to the `formly-group` component.
   */
  fieldGroupClassName?: string;

  /**
   * A field group is a way to group fields together, making advanced layout very simple.
   * It can also be used to group fields that are associated with the same model (useful if it's different than the model for the rest of the fields).
   */
  fieldGroup?: FormlyFieldConfig[];

  fieldArray?: FormlyFieldConfig;

  /**
   * This should be a formly-field type added either by you or a plugin. More information over at Creating Formly Fields.
   */
  type?: string;

  /**
   * Whether to focus or blur the element field. Defaults to false. If you wish this to be conditional use `expressionProperties`
   */
  focus?: boolean;

  /**
   * An object with a few useful properties to control the model changes
   * - `debounce`: integer value which contains the debounce model update value in milliseconds. A value of 0 triggers an immediate update.
   * - `updateOn`: string event value that instructs when the control should be updated
   */
  modelOptions?: {
    debounce?: {
      default: number;
    };
    /**
     * @see https://angular.io/api/forms/AbstractControl#updateOn
     */
    updateOn?: 'change' | 'blur' | 'submit';
  };

  hooks?: FormlyLifeCycleOptions<FormlyHookFn>;

  /**
   * @deprecated use `hooks` instead
   */
  lifecycle?: FormlyLifeCycleOptions;

  /**
   * Use `defaultValue` to initialize it the model. If this is provided and the value of the model at compile-time is undefined, then the value of the model will be assigned to `defaultValue`.
   */
  defaultValue?: any;

  /**
   * Array of functions to execute, as a pipeline, whenever the model updates, usually via user input.
   */
  parsers?: ((value: any) => {})[];
}

export interface ExpressionPropertyCache {
  expression: (model: any, formState: any, field: FormlyFieldConfigCache) => boolean;
  expressionValueSetter: (value: any) => void;
  expressionValue?: any;
}

export interface FormlyFieldConfigCache extends FormlyFieldConfig {
  parent?: FormlyFieldConfigCache;
  options?: FormlyFormOptionsCache;
  _expressionProperties?: { [property: string]: ExpressionPropertyCache };
  _validators?: ValidatorFn;
  _asyncValidators?: AsyncValidatorFn;
  _componentRefs?: ComponentRef<FieldType>[];
  _componentFactory?: {
    type: string;
    component: any;
    componentRef?: ComponentRef<FieldType>;
  };
  _keyPath?: {
    key: string;
    path: string[];
  };
}

export type FormlyAttributeEvent = (field: FormlyFieldConfig, event?: any) => void;

export interface FormlyTemplateOptions {
  type?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  options?: any[] | Observable<any[]>;
  rows?: number;
  cols?: number;
  description?: string;
  hidden?: boolean;
  max?: number;
  min?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string|RegExp;
  required?: boolean;
  tabindex?: number;
  readonly?: boolean;
  attributes?: { [key: string]: string|number };
  step?: number;
  focus?: FormlyAttributeEvent;
  blur?: FormlyAttributeEvent;
  keyup?: FormlyAttributeEvent;
  keydown?: FormlyAttributeEvent;
  click?: FormlyAttributeEvent;
  change?: FormlyAttributeEvent;
  keypress?: FormlyAttributeEvent;
  templateManipulators?: TemplateManipulators;
  [additionalProperties: string]: any;
}

export interface FormlyLifeCycleFn {
  (form?: FormGroup, field?: FormlyFieldConfig, model?: any, options?: FormlyFormOptions): void;
}

export interface FormlyHookFn {
  (field?: FormlyFieldConfig): void;
}

export interface FormlyLifeCycleOptions<T = FormlyLifeCycleFn> {
  onInit?: T;
  onChanges?: T;
  doCheck?: T;
  afterContentInit?: T;
  afterContentChecked?: T;
  afterViewInit?: T;
  afterViewChecked?: T;
  onDestroy?: T;
  [additionalProperties: string]: any;
}

export interface FormlyFormOptionsCache extends FormlyFormOptions {
  _checkField?: (field: FormlyFieldConfigCache, ignoreCache?: boolean) => void;
  _markForCheck?: (field: FormlyFieldConfigCache) => void;
  _buildForm?: () => void;
  _componentFactoryResolver?: ComponentFactoryResolver;
  _injector?: Injector;
}
export interface FormlyFormOptions {
  updateInitialValue?: () => void;
  resetModel?: (model?: any) => void;
  formState?: any;
  fieldChanges?: Subject<FormlyValueChangeEvent>;
  fieldTransform?: (fields: FormlyFieldConfig[], model: any, form: FormGroup | FormArray, options: FormlyFormOptions) => FormlyFieldConfig[];
  showError?: (field: FieldType) => boolean;
  parentForm?: FormGroupDirective | null;
}

export interface FormlyValueChangeEvent {
  field: FormlyFieldConfig;
  type: string;
  value: any;
}

