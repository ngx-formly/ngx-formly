import { Injectable, InjectionToken, ComponentRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { FieldType } from './../templates/field.type';
import { reverseDeepMerge, defineHiddenProp } from './../utils';
import {
  FormlyFieldConfig,
  FormlyFieldConfigCache,
  ConfigOption,
  TypeOption,
  ValidatorOption,
  WrapperOption,
  FormlyExtension,
} from '../models';

export const FORMLY_CONFIG = new InjectionToken<ConfigOption[]>('FORMLY_CONFIG');

/**
 * Maintains list of formly field directive types. This can be used to register new field templates.
 */
@Injectable({ providedIn: 'root' })
export class FormlyConfig {
  types: { [name: string]: TypeOption } = {};
  validators: { [name: string]: ValidatorOption } = {};
  wrappers: { [name: string]: WrapperOption } = {};
  messages: { [name: string]: string | ((error: any, field: FormlyFieldConfig) => string) } = {};
  extras: ConfigOption['extras'] = {
    checkExpressionOn: 'changeDetectionCheck',
    showError(field: FieldType) {
      return (
        field.formControl &&
        field.formControl.invalid &&
        (field.formControl.touched ||
          (field.options.parentForm && field.options.parentForm.submitted) ||
          (field.field.validation && field.field.validation.show))
      );
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
    if (config.validationMessages) {
      config.validationMessages.forEach(validation => this.addValidatorMessage(validation.name, validation.message));
    }
    if (config.extensions) {
      config.extensions.forEach(c => (this.extensions[c.name] = c.extension));
    }
    if (config.extras) {
      this.extras = { ...this.extras, ...config.extras };
    }
  }

  setType(options: TypeOption | TypeOption[]) {
    if (Array.isArray(options)) {
      options.forEach(option => this.setType(option));
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
        options.wrappers.forEach(wrapper => this.setTypeWrapper(options.name, wrapper));
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

    const componentRef = this.createComponent(field);
    if (componentRef && componentRef.instance && componentRef.instance.defaultOptions) {
      reverseDeepMerge(field, componentRef.instance.defaultOptions);
    }

    if (!field.wrappers && type.wrappers) {
      field.wrappers = [...type.wrappers];
    }
  }

  /** @internal */
  createComponent(
    field: FormlyFieldConfigCache = {},
    resolver?: ComponentFactoryResolver,
    injector?: Injector,
  ): ComponentRef<FieldType> {
    if (!field.type) {
      return;
    }

    const cf = field._componentFactory;
    if (
      cf &&
      field.type === cf.type &&
      cf.componentRef &&
      cf.componentRef.hostView &&
      !cf.componentRef.hostView.destroyed
    ) {
      return field._componentFactory.componentRef;
    }

    const type = this.getType(field.type);
    if (!resolver) {
      resolver = field.options._componentFactoryResolver;
    }
    if (!injector) {
      injector = this.getFieldInjector(field);
    }

    defineHiddenProp(field, '_componentFactory', {
      type: field.type,
      component: type.component,
      componentRef: resolver ? resolver.resolveComponentFactory(type.component).create(injector) : null,
    });

    const componentRef = field._componentFactory.componentRef;
    if (componentRef) {
      defineHiddenProp(field, 'componentInstance', componentRef.instance);
      Object.assign(componentRef.instance, { field });
    }

    return componentRef;
  }

  setWrapper(options: WrapperOption) {
    this.wrappers[options.name] = options;
    if (options.types) {
      options.types.forEach(type => {
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

  private getFieldInjector(field: FormlyFieldConfigCache = {}) {
    const parent = field.parent;
    if (parent && parent._componentFactory && parent._componentFactory.componentRef) {
      return parent._componentFactory.componentRef.injector;
    }

    return field.options._injector;
  }
}
