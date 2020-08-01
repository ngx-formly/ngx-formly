import { Injectable, InjectionToken, ComponentRef } from '@angular/core';
import { ValidationErrors, AbstractControl } from '@angular/forms';
import { FieldType } from './../templates/field.type';
import { reverseDeepMerge, defineHiddenProp } from './../utils';
import { FormlyFieldConfig, FormlyFieldConfigCache } from '../components/formly.field.config';
import { Observable } from 'rxjs';

export const FORMLY_CONFIG = new InjectionToken<FormlyConfig>('FORMLY_CONFIG');

/** @experimental */
export interface FormlyExtension {
  prePopulate?(field: FormlyFieldConfig): void;
  onPopulate?(field: FormlyFieldConfig): void;
  postPopulate?(field: FormlyFieldConfig): void;
}

/**
 * Maintains list of formly field directive types. This can be used to register new field templates.
 */
@Injectable({ providedIn: 'root' })
export class FormlyConfig {
  types: {[name: string]: TypeOption} = {};
  validators: { [name: string]: ValidatorOption } = {};
  wrappers: { [name: string]: WrapperOption } = {};
  messages: { [name: string]: ValidationMessageOption['message'] } = {};
  templateManipulators: {
    preWrapper: ManipulatorWrapper[];
    postWrapper: ManipulatorWrapper[];
  } = {
    preWrapper: [],
    postWrapper: [],
  };
  extras: ConfigOption['extras'] = {
    checkExpressionOn: 'changeDetectionCheck',
    lazyRender: false,
    showError: function(field: FieldType) {
      return field.formControl && field.formControl.invalid && (field.formControl.touched || (field.options.parentForm && field.options.parentForm.submitted) || !!(field.field.validation && field.field.validation.show));
    },
  };
  extensions: { [name: string]: FormlyExtension } = {};

  addConfig(config: ConfigOption) {
    if (config.types) {
      config.types.forEach(type => this.setType(type));
    }
    if (config.validators) {
      config.validators.forEach(validator => this.setValidator(validator));
    }
    if (config.wrappers) {
      config.wrappers.forEach(wrapper => this.setWrapper(wrapper));
    }
    if (config.manipulators) {
      console.warn(`NgxFormly: passing 'manipulators' config is deprecated, use custom extension instead.`);
      config.manipulators.forEach(manipulator => this.setManipulator(manipulator));
    }
    if (config.validationMessages) {
      config.validationMessages.forEach(validation => this.addValidatorMessage(validation.name, validation.message));
    }
    if (config.extensions) {
      config.extensions.forEach(c => this.extensions[c.name] = c.extension);
    }
    if (config.extras) {
      this.extras = { ...this.extras, ...config.extras };
    }
  }

  setType(options: TypeOption | TypeOption[]) {
    if (Array.isArray(options)) {
      options.forEach((option) => this.setType(option));
    } else {
      if (!this.types[options.name]) {
        this.types[options.name] = <TypeOption>{ name: options.name };
      }

      ['component', 'extends', 'defaultOptions'].forEach(prop => {
        if (options.hasOwnProperty(prop)) {
          this.types[options.name][prop] = options[prop];
        }
      });

      if (options.wrappers) {
        options.wrappers.forEach((wrapper) => this.setTypeWrapper(options.name, wrapper));
      }
    }
  }

  getType(name: string): TypeOption {
    if (!this.types[name]) {
      throw new Error(`[Formly Error] The type "${name}" could not be found. Please make sure that is registered through the FormlyModule declaration.`);
    }

    this.mergeExtendedType(name);

    return this.types[name];
  }

  getMergedField(field: FormlyFieldConfig = {}): any {
    const type = this.getType(field.type);
    if (type.defaultOptions) {
      reverseDeepMerge(field, type.defaultOptions);
    }

    const extendDefaults = type.extends && this.getType(type.extends).defaultOptions;
    if (extendDefaults) {
      reverseDeepMerge(field, extendDefaults);
    }

    if (field && field.optionsTypes) {
      field.optionsTypes.forEach(option => {
        const defaultOptions = this.getType(option).defaultOptions;
        if (defaultOptions) {
          reverseDeepMerge(field, defaultOptions);
        }
      });
    }

    const componentRef = this.resolveFieldTypeRef(field);
    if (componentRef && componentRef.instance && componentRef.instance.defaultOptions) {
      reverseDeepMerge(field, componentRef.instance.defaultOptions);
    }

    if (!field.wrappers && type.wrappers) {
      field.wrappers = [...type.wrappers];
    }
  }

  /** @internal */
  resolveFieldTypeRef(field: FormlyFieldConfigCache = {}): ComponentRef<FieldType> {
    if (!field.type) {
      return null;
    }

    const type = this.getType(field.type);
    if (!type.component || type['_componentRef']) {
      return type['_componentRef'];
    }

    const { _resolver, _injector } = field.parent.options;
    defineHiddenProp(
      type,
      '_componentRef',
      _resolver.resolveComponentFactory<FieldType>(type.component).create(_injector),
    );

    return type['_componentRef'];
  }

  setWrapper(options: WrapperOption) {
    this.wrappers[options.name] = options;
    if (options.types) {
      options.types.forEach((type) => {
        this.setTypeWrapper(type, options.name);
      });
    }
  }

  getWrapper(name: string): WrapperOption {
    if (!this.wrappers[name]) {
      throw new Error(`[Formly Error] The wrapper "${name}" could not be found. Please make sure that is registered through the FormlyModule declaration.`);
    }

    return this.wrappers[name];
  }

  setTypeWrapper(type: string, name: string) {
    if (!this.types[type]) {
      this.types[type] = <TypeOption>{};
    }
    if (!this.types[type].wrappers) {
      this.types[type].wrappers = [];
    }
    if (this.types[type].wrappers.indexOf(name) === -1) {
      this.types[type].wrappers.push(name);
    }
  }

  setValidator(options: ValidatorOption) {
    this.validators[options.name] = options;
  }

  getValidator(name: string): ValidatorOption {
    if (!this.validators[name]) {
      throw new Error(`[Formly Error] The validator "${name}" could not be found. Please make sure that is registered through the FormlyModule declaration.`);
    }

    return this.validators[name];
  }

  addValidatorMessage(name: string, message: ValidationMessageOption['message']) {
    this.messages[name] = message;
  }

  getValidatorMessage(name: string) {
    return this.messages[name];
  }

  setManipulator(manipulator: ManipulatorOption) {
    new manipulator.class()[manipulator.method](this);
  }

  private mergeExtendedType(name: string) {
    if (!this.types[name].extends) {
      return;
    }

    const extendedType = this.getType(this.types[name].extends);
    if (!this.types[name].component) {
      this.types[name].component = extendedType.component;
    }

    if (!this.types[name].wrappers) {
      this.types[name].wrappers = extendedType.wrappers;
    }
  }
}
export interface TypeOption {
  name: string;
  component?: any;
  wrappers?: string[];
  extends?: string;
  defaultOptions?: FormlyFieldConfig;
}

export interface WrapperOption {
  name: string;
  component: any;
  types?: string[];
}

export interface FieldValidatorFn {
  (c: AbstractControl, field: FormlyFieldConfig, options?: { [id: string]: any; }): ValidationErrors | null;
}

export interface ValidatorOption {
  name: string;
  validation: FieldValidatorFn;
  options?: { [id: string]: any };
}

export interface ExtensionOption {
  name: string;
  extension: FormlyExtension;
}

export interface ValidationMessageOption {
  name: string;
  message: string | ((error: any, field: FormlyFieldConfig) => string | Observable<string>);
}

export interface ManipulatorOption {
  class?: { new (): any };
  method?: string;
}

export interface ManipulatorWrapper {
  (f: FormlyFieldConfig): string;
}

export interface TemplateManipulators {
  preWrapper?: ManipulatorWrapper[];
  postWrapper?: ManipulatorWrapper[];
}

export interface ConfigOption {
  types?: TypeOption[];
  wrappers?: WrapperOption[];
  validators?: ValidatorOption[];
  extensions?: ExtensionOption[];
  validationMessages?: ValidationMessageOption[];

  /** @deprecated use `extensions` instead */
  manipulators?: ManipulatorOption[];
  extras?: {
    /** @deprecated use `extensions` instead */
    fieldTransform?: any,
    immutable?: boolean,
    showError?: (field: FieldType) => boolean;

    /**
     * Defines the option which formly rely on to check field expression properties.
     * - `modelChange`: perform a check when the value of the form control changes (Will be set by default in the next major version).
     * - `changeDetectionCheck`: triggers an immediate check when `ngDoCheck` is called.
     *
     * Defaults to `changeDetectionCheck`.
     */
    checkExpressionOn?: 'modelChange' | 'changeDetectionCheck',

    /**
     * Whether to lazily render field components or not when marked as hidden.
     * - `true`: lazily render field components (Will be set by default in the next major version).
     * - `false`: render field components and use CSS to control their visibility.
     *
     * Defaults to `false`.
     */
    lazyRender?: boolean,
  };
}
