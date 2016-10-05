import {Injectable, Inject, OpaqueToken} from '@angular/core';

export const FORMLY_CONFIG_TOKEN = new OpaqueToken('FORMLY_CONFIG_TOKEN');

/**
 * Maintains list of formly field directive types. This can be used to register new field templates.
 */
@Injectable()
export class FormlyConfig {
  types: {[name: string]: TypeOption} = {};
  validators: {[name: string]: ValidatorOption} = {};
  wrappers: {[name: string]: WrapperOption} = {};

  constructor(@Inject(FORMLY_CONFIG_TOKEN) configs) {
    configs.map(config => {
      if (config.types) {
        config.types.map(type => this.setType(type));
      }
      if (config.validators) {
        config.validators.map(validator => this.setValidator(validator));
      }
      if (config.wrappers) {
        config.wrappers.map(wrapper => this.setWrapper(wrapper));
      }
    });
  }

  setType(options: TypeOption) {
    this.types[options.name] = options;
  }

  getType(name: string): TypeOption {
    if (!this.types[name]) {
      throw new Error(`[Formly Error] There is no type by the name of "${name}"`);
    }

    if (!this.types[name].component && this.types[name].extends) {
      this.types[name].component = this.getType(this.types[name].extends).component;
    }

    return this.types[name];
  }

  setWrapper(options: WrapperOption) {
    this.wrappers[options.name] = options;
  }

  getWrapper(name: string): WrapperOption {
    if (!this.wrappers[name]) {
      throw new Error(`[Formly Error] There is no wrapper by the name of "${name}"`);
    }

    return this.wrappers[name];
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
}

export interface TypeOption {
  name: string;
  component?: any;
  wrappers?: [string];
  extends?: string;
}

export interface WrapperOption {
  name: string;
  component: any;
}

export interface ValidatorOption {
  name: string;
  validation: any;
}

export interface ValidationMessageOption {
  name: string;
  message: any;
}

export interface ConfigOption {
  types?: [TypeOption];
  wrappers?: [WrapperOption];
  validators?: [ValidatorOption];
  validationMessages?: [ValidationMessageOption];
}
