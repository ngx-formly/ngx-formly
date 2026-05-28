import {
  UnitTestTree,
  SchematicTestRunner,
} from '@angular-devkit/schematics/testing';

const defaultWorkspaceOptions = {
  name: 'workspace',
  version: '6.0.0',
  newProjectRoot: 'projects',
};

const defaultAppOptions = {
  name: 'formly',
  inlineStyle: false,
  inlineTemplate: false,
  viewEncapsulation: 'Emulated',
  routing: false,
  style: 'css',
  skipTests: false,
  standalone: false,
};

// const defaultModuleOptions = {
//   name: 'foo',
//   spec: true,
//   module: undefined,
//   flat: false,
// };

export function getTestProjectPath(
  workspaceOptions = defaultWorkspaceOptions,
  appOptions = defaultAppOptions,
) {
  return `/${workspaceOptions.newProjectRoot}/${appOptions.name}`;
}

export async function createWorkspace(
  schematicRunner: SchematicTestRunner,
  appTree: UnitTestTree,
  workspaceOptions = defaultWorkspaceOptions,
  appOptions = defaultAppOptions,
) {
  appTree = await schematicRunner
    .runExternalSchematic(
      '@schematics/angular',
      'workspace',
      workspaceOptions,
    );

  return await schematicRunner
    .runExternalSchematic(
      '@schematics/angular',
      'application',
      appOptions,
      appTree,
    );
}
