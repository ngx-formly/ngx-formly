import {Injectable} from "@angular/core";

/**
 * Maintains list of formly field directive types. This can be used to register new field templates.
 */
@Injectable()
export class FormlyConfig {
  types = {};
  setType(options) {
    this.types[options.name] = options.component;
  }

  getDirectives() {
    return this.types;
  }
}
