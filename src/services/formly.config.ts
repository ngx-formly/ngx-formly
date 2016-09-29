import {Injectable} from "@angular/core";

/**
 * Maintains list of formly field directive types. This can be used to register new field templates.
 */
@Injectable()
export class FormlyConfig {
  types: {[name: string]: TypeOption} = {};
  validators: {[name: string]: ValidatorOption} = {};

  setType(options: TypeOption) {
    this.types[options.name] = options;
  }

  getType(name: string): TypeOption {
    return this.types[name];
  }

  setValidator(options: ValidatorOption) {
    this.validators[options.name] = options;
  }

  getValidator(name: string): ValidatorOption {
    return this.validators[name];
  }
}

export interface TypeOption {
  name: string;
  component: any;
}

export interface ValidatorOption {
  name: string;
  validation: any;
}
