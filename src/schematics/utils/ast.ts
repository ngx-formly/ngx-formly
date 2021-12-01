import { normalize } from '@angular-devkit/core';
import { SchematicsException, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { findModuleFromOptions as internalFindModule } from '@schematics/angular/utility/find-module';
import { WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { getWorkspace } from '@schematics/angular/utility/workspace';

/** Reads file given path and returns TypeScript source file. */
export function parseSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not find file for path: ${path}`);
  }
  return ts.createSourceFile(path, buffer.toString(), ts.ScriptTarget.Latest, true);
}

/** Import and add module to root app module. */
export function addModuleImportToRootModule(host: Tree, moduleName: string, src: string, project: WorkspaceProject) {
  const modulePath = getAppModulePath(host, project.architect.build.options.main);
  addModuleImportToModule(host, modulePath, moduleName, src);
}

/**
 * Import and add module to specific module path.
 * @param host the tree we are updating
 * @param modulePath src location of the module to import
 * @param moduleName name of module to import
 * @param src src location to import
 */
export function addModuleImportToModule(host: Tree, modulePath: string, moduleName: string, src: string) {
  const moduleSource = parseSourceFile(host, modulePath);

  if (!moduleSource) {
    throw new SchematicsException(`Module not found: ${modulePath}`);
  }

  const changes = addImportToModule(moduleSource, modulePath, moduleName, src);
  const recorder = host.beginUpdate(modulePath);

  changes.forEach((change) => {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  });

  host.commitUpdate(recorder);
}

/** Gets the app index.html file */
export function getIndexHtmlPath(host: Tree, project: WorkspaceProject): string {
  const buildTarget = project.architect.build.options;

  if (buildTarget.index && buildTarget.index.endsWith('index.html')) {
    return buildTarget.index;
  }

  throw new SchematicsException('No index.html file was found.');
}

/** Get the root stylesheet file. */
export function getStylesPath(host: Tree, project: WorkspaceProject): string {
  const buildTarget = project.architect['build'];

  if (buildTarget.options && buildTarget.options.styles && buildTarget.options.styles.length) {
    const styles = buildTarget.options.styles.map(s => typeof s === 'string' ? s : (s as any).input);

    // First, see if any of the assets is called "styles.(le|sc|c)ss", which is the default
    // "main" style sheet.
    const defaultMainStylePath = styles.find(a => /styles\.(c|le|sc)ss/.test(a));
    if (defaultMainStylePath) {
      return normalize(defaultMainStylePath);
    }

    // If there was no obvious default file, use the first style asset.
    const fallbackStylePath = styles.find(a => /\.(c|le|sc)ss/.test(a));
    if (fallbackStylePath) {
      return normalize(fallbackStylePath);
    }
  }

  throw new SchematicsException('No style files could be found into which a theme could be added');
}

/** Wraps the internal find module from options with undefined path handling  */
export async function findModuleFromOptions(
  host: Tree,
  options: any,
): Promise<string | undefined> {
  const workspace = await getWorkspace(host);

  if (!options.project) {
    options.project = Array.from(workspace.projects.keys())[0];
  }

  const project = workspace.projects.get(options.project)!;

  if (options.path === undefined) {
    options.path = `/${project.root}/src/app`;
  }

  return internalFindModule(host, options);
}
