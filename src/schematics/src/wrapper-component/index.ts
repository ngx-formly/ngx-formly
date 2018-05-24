import { chain, Rule } from '@angular-devkit/schematics';
import buildComponent from '@schematics/angular/component';
import { Schema } from './schema';

/**
 * Scaffolds a new wrapper component.
 * Internally it bootstraps the base component schematic
 */
export default function(options: Schema): Rule {
  return chain([
    buildComponent({ ...options }),
    // options.skipImport ? noop() : addWrapperToModule(options),
  ]);
}

/**
 * Add the wrapper component to FormlyModule
 */
// function addWrapperToModule(options: Schema) {
//   return (host: Tree) => {
//     return host;
//   };
// }
