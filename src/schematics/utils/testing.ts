import {
  UnitTestTree,
  SchematicTestRunner,
} from '@angular-devkit/schematics/testing';

const defaultWorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '6.0.0',
};

const defaultAppOptions = {
  name: 'formly',
  inlineStyle: false,
  inlineTemplate: false,
  viewEncapsulation: 'Emulated',
  routing: false,
  style: 'css',
  skipTests: false,
};

// const defaultModuleOptions = {
//   name: 'foo',
//   spec: true,
//   module: undefined,
//   flat: false,
// };

export function getTestProjectPath(
  workspaceOptions: any = defaultWorkspaceOptions,
  appOptions: any = defaultAppOptions,
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
    .runExternalSchematicAsync(
      '@schematics/angular',
      'workspace',
      workspaceOptions,
    )
    .toPromise();

  return await schematicRunner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'application',
      appOptions,
      appTree,
    )
    .toPromise();
}
