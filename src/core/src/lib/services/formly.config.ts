import { Injectable, InjectionToken, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { ValidationErrors, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { FieldType } from './../templates/field.type';
import { reverseDeepMerge, defineHiddenProp } from './../utils';
import { FormlyFieldConfig, FormlyFormOptions, FormlyFieldConfigCache } from '../components/formly.field.config';

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
  messages: { [name: string]: string | ((error: any, field: FormlyFieldConfig) => string); } = {};
  templateManipulators: {
    preWrapper: ManipulatorWrapper[];
    postWrapper: ManipulatorWrapper[];
  } = {
    preWrapper: [],
    postWrapper: [],
  };
  extras: {
    fieldTransform?: ((fields: FormlyFieldConfig[], model: any, form: FormGroup | FormArray, options: FormlyFormOptions) => FormlyFieldConfig[])[],
    showError?: (field: FieldType) => boolean;
  } = {
    fieldTransform: undefined,
    showError: function(field: FieldType) {
      return field.formControl && field.formControl.invalid && (field.formControl.touched || (field.options.parentForm && field.options.parentForm.submitted) || (field.field.validation && field.field.validation.show));
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
        this.types[options.name] = <TypeOption>{};
      }
      this.types[options.name].component = options.component;
      this.types[options.name].name = options.name;
      this.types[options.name].extends = options.extends;
      this.types[options.name].defaultOptions = options.defaultOptions;
      if (options.wrappers) {
        options.wrappers.forEach((wrapper) => this.setTypeWrapper(options.name, wrapper));
      }
    }
  }

  getType(name: string): TypeOption {
    if (!this.types[name]) {
      throw new Error(`[Formly Error] There is no type by the name of "${name}"`);
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

    const componentRef = this.createComponentInstance(field);
    if (componentRef && componentRef.instance && componentRef.instance.defaultOptions) {
      reverseDeepMerge(field, componentRef.instance.defaultOptions);
    }

    if (!field.wrappers && type.wrappers) {
      field.wrappers = [...type.wrappers];
    }
  }

  /** @internal */
  createComponentInstance(field: FormlyFieldConfigCache = {}, resolver?: ComponentFactoryResolver): ComponentRef<FieldType> {
    if (!field.type) {
      return;
    }

    if (field._componentFactory && field.type === field._componentFactory.type) {
      return field._componentFactory.componentRef;
    }

    const type = this.getType(field.type);
    if (!resolver) {
      resolver = field.parent.options._componentFactoryResolver;
    }

    defineHiddenProp(field, '_componentFactory', {
      type: field.type,
      component: type.component,
      componentRef: resolver
        ? resolver.resolveComponentFactory(type.component).create((<any> resolver)._ngModule.injector)
        : null,
    });

    return field._componentFactory.componentRef;
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
      throw new Error(`[Formly Error] There is no wrapper by the name of "${name}"`);
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
      throw new Error(`[Formly Error] There is no validator by the name of "${name}"`);
    }

    return this.validators[name];
  }

  addValidatorMessage(name: string, message: string | ((error: any, field: FormlyFieldConfig) => string)) {
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
  (c: AbstractControl, field: FormlyFieldConfig): ValidationErrors | null;
}

export interface ValidatorOption {
  name: string;
  validation: FieldValidatorFn;
}

export interface ExtensionOption {
  name: string;
  extension: FormlyExtension;
}

export interface ValidationMessageOption {
  name: string;
  message: string | ((error: any, field: FormlyFieldConfig) => string);
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
    fieldTransform?: any,
    showError?: (field: FieldType) => boolean;
  };
}
