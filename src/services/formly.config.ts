import {Injectable, ViewContainerRef} from "@angular/core";

/**
 * Maintains list of formly field directive types. This can be used to register new field templates.
 */
@Injectable()
export class FormlyConfig {
  types: {[name: string]: TypeOption} = {};
  manipulators: {[name: string]: TemplateManipulator} = {};

  setType(options: TypeOption) {
    this.types[options.name] = options;
  }

  getType(name: string): TypeOption {
    return this.types[name];
  }

  addTemplateManipulator(option: TemplateManipulatorOption): void {
    this.manipulators[option.name] = option.manipulator;
  }

  getManipulator(name: string): TemplateManipulator {
    return this.manipulators[name];
  }
}

export interface TypeOption {
  name: string;
  component: any;
}

export interface TemplateManipulatorOption {
  name: string;
  manipulator: TemplateManipulator;
}

export interface TemplateManipulator {
  preProcess(ref: ViewContainerRef): void;
  postProcess(ref: ViewContainerRef): void;
}
