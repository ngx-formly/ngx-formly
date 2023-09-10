/**
 * https://github.com/angular/components/tree/main/src/cdk/schematics
 */

import { normalize } from '@angular-devkit/core';
import { SchematicsException, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { findModuleFromOptions as internalFindModule } from '@schematics/angular/utility/find-module';
import { WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import {Schema as ComponentOptions} from '@schematics/angular/component/schema';
import {Path} from '@angular-devkit/core';
import {JsonValue} from '@angular-devkit/core';
import {ProjectDefinition} from '@angular-devkit/core/src/workspace';
import { addModuleImportToModule } from '@angular/cdk/schematics';
/** Reads file given path and returns TypeScript source file. */
export function parseSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not find file for path: ${path}`);
  }
  return ts.createSourceFile(path, buffer.toString(), ts.ScriptTarget.Latest, true);
}

/** Import and add module to root app module. */
export function addModuleImportToRootModule(host: Tree, moduleName: string, src: string, project: ProjectDefinition) {
  const modulePath = getAppModulePath(host, getProjectMainFile(project));
  addModuleImportToModule(host, modulePath, moduleName, src);
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
  options: ComponentOptions,
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

export function getProjectMainFile(project: ProjectDefinition): Path {
  const buildOptions = getProjectTargetOptions(project, 'build');

  if (!buildOptions.main) {
    throw new SchematicsException(
      `Could not find the project main file inside of the ` +
        `workspace config (${project.sourceRoot})`,
    );
  }

  return buildOptions.main as Path;
}

export function getProjectTargetOptions(
  project: ProjectDefinition,
  buildTarget: string,
): Record<string, JsonValue | undefined> {
  const options = project.targets?.get(buildTarget)?.options;

  if (!options) {
    throw new SchematicsException(
      `Cannot determine project target configuration for: ${buildTarget}.`,
    );
  }

  return options;
}
