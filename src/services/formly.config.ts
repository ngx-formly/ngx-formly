import {Injectable} from "@angular/core";

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
