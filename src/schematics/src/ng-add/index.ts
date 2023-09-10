import { chain, noop, Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { findModuleFromOptions } from '../../utils/ast';
import { addModuleImportToModule } from '@angular/cdk/schematics';
import { angularVersion, ngxFormlyVersion } from '../../utils/lib-versions';
import { addPackageToPackageJson } from '../../utils/package';
import { Schema } from './schema';

/**
 * Scaffolds the basics of a Angular Material application, this includes:
 *  - Add Packages to package.json
 *  - Adds pre-built themes to styles.ext
 *  - Adds Browser Animation to app.module
 */
export function ngAdd(options: Schema): Rule {
  return chain([
    options && options.skipPackageJson ? noop() : addFormlyToPackageJson(),
    addFormlyModuleConfig(options),
    options && options.uiTheme ? addUITheme(options) : noop(),
  ]);
}

/** Add @angular/forms, @ngx-formly/core to package.json if not already present. */
function addFormlyToPackageJson() {
  return (host: Tree, context: SchematicContext) => {
    addPackageToPackageJson(host, 'dependencies', '@angular/forms', angularVersion);
    addPackageToPackageJson(host, 'dependencies', '@ngx-formly/core', ngxFormlyVersion);

    context.addTask(new NodePackageInstallTask());

    return host;
  };
}

/** Add formly module to the relative module */
function addFormlyModuleConfig(options: Schema) {
  return async (host: Tree) => {
    const modulePath = (await findModuleFromOptions(host, options))!;
    addModuleImportToModule(host, modulePath, 'FormlyModule.forRoot()', '@ngx-formly/core');
    addModuleImportToModule(host, modulePath, 'ReactiveFormsModule', '@angular/forms');
  };
}

/** Add UI module to app.module */
function addUITheme(options: Schema) {
  return async (host: Tree) => {
    const modulePath = await findModuleFromOptions(host, options);
    const uiTheme = options.uiTheme;

    if (uiTheme) {
      addPackageToPackageJson(host, 'dependencies', `@ngx-formly/${uiTheme}`, ngxFormlyVersion);

      addModuleImportToModule(host, modulePath, `Formly${mapUIName(uiTheme)}Module`, `@ngx-formly/${uiTheme}`);
    }
  };
}

interface UIModuleName {
  [uiName: string]: string;
}

// @TODO: available themes should probably be moved to some config file
function mapUIName(uiTheme: string): string {
  const uiMap: UIModuleName = {
    bootstrap: 'Bootstrap',
    material: 'Material',
    nativescript: 'Nativescript',
    ionic: 'Ionic',
    primeng: 'PrimeNG',
    kendo: 'Kendo',
    'ng-zorro-antd': 'NgZorroAntd',
  };

  return uiMap[uiTheme];
}
