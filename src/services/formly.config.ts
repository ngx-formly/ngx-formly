import {Injectable} from "@angular/core";

/**
 * Maintains list of formly field directive types. This can be used to register new field templates.
 */
@Injectable()
export class FormlyConfig {
  types: {[name: string]: TypeOption} = {};

  setType(options: TypeOption) {
    this.types[options.name] = options;
  }

  getType(name: string): TypeOption {
    return this.types[name];
  }
}

export interface TypeOption {
  name: string;
  component: any;
}
