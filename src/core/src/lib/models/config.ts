import { ComponentRef, Type } from '@angular/core';
import { ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { FormlyFieldConfig } from './fieldconfig';
import { FieldType } from './../templates/field.type';
import { FieldWrapper } from '../templates/field.wrapper';

export declare interface FormlyFieldComponentRef {
  _componentRef?: ComponentRef<any>;
}

export interface FormlyExtension<F extends FormlyFieldConfig = FormlyFieldConfig> {
  priority?: number;

  prePopulate?(field: F): void;
  onPopulate?(field: F): void;
  postPopulate?(field: F): void;
}

export declare interface TypeOption {
  name: string;
  component?: Type<FieldType>;
  wrappers?: string[];
  extends?: string;
  defaultOptions?: FormlyFieldConfig;
}

export interface WrapperOption {
  name: string;
  component: Type<FieldWrapper>;
  types?: string[];
}

export type FieldValidatorFn = (
  c: AbstractControl,
  field: FormlyFieldConfig,
  options?: { [id: string]: any },
) => ValidationErrors | null;

export interface ValidatorOption {
  name: string;
  validation: FieldValidatorFn;
  options?: { [id: string]: any };
}

export interface ExtensionOption {
  name: string;
  extension: FormlyExtension;
  priority?: number;
}

export interface ValidationMessageOption {
  name: string;
  message: string | ((error: any, field: FormlyFieldConfig) => string | Observable<string>);
}

export interface PresetOption {
  name: string;
  config: FormlyFieldConfig | FormlyFieldConfigPresetProvider;
}

export interface FormlyFieldConfigPresetProvider {
  getConfiguration: () => FormlyFieldConfig;
}

export interface ConfigOption {
  types?: TypeOption[];
  wrappers?: WrapperOption[];
  validators?: ValidatorOption[];
  extensions?: ExtensionOption[];
  validationMessages?: ValidationMessageOption[];
  extras?: {
    immutable?: boolean;
    showError?: (field: FieldType) => boolean;

    /**
     * Defines the option which formly rely on to check field expression properties.
     * - `modelChange`: perform a check when the value of the form control changes.
     * - `changeDetectionCheck`: triggers an immediate check when `ngDoCheck` is called.
     *
     * Defaults to `modelChange`.
     */
    checkExpressionOn?: 'modelChange' | 'changeDetectionCheck';

    /**
     * Whether to lazily render field components or not when marked as hidden.
     * - `true`: lazily render field components.
     * - `false`: render field components and use CSS to control their visibility.
     *
     * Defaults to `true`.
     */
    lazyRender?: boolean;

    /**
     * When `true`, reset the value of a hidden field.
     *
     * Defaults to `true`.
     */
    resetFieldOnHide?: boolean;

    /**
     * Whether to render fields inside <formly-field> component or not.
     *
     * Defaults to `true`.
     */
    renderFormlyFieldElement?: boolean;
  };
  presets?: PresetOption[];
}
