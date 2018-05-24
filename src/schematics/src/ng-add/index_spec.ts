import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { join } from 'path';
import { getFileContent } from '@schematics/angular/utility/test';
import { createWorkspace, getTestProjectPath } from '../../utils/testing';
import { Schema } from './schema';

describe('ng-add-schematic', () => {
  const collectionPath = join(__dirname, '../collection.json');
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);
  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createWorkspace(schematicRunner, appTree);
  });

  it('should update package.json', () => {
    const tree = schematicRunner.runSchematic('ng-add', {}, appTree);
    const packageJson = JSON.parse(getFileContent(tree, '/package.json'));

    expect(packageJson.dependencies['@angular/forms']).toBeDefined();
    expect(packageJson.dependencies['@ngx-formly/core']).toBeDefined();
  });

  it('should not add a theme by default to package.json', () => {
    const tree = schematicRunner.runSchematic('ng-add', {}, appTree);
    const packageJson = JSON.parse(getFileContent(tree, '/package.json'));

    // @TODO: list of themes should probably be retrieved from some config file
    ['material', 'bootstrap', 'ionic', 'primeng', 'kendo'].forEach(theme => {
      expect(packageJson.dependencies[`@ngx-formly/${theme}`]).toBeUndefined();
    });
  });

  it('should skip package.json update', () => {
    const options = { skipPackageJson: true } as Schema;
    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const packageJson = JSON.parse(getFileContent(tree, '/package.json'));

    expect(packageJson.dependencies['@ngx-formly/core']).toBeUndefined();
  });

  it('should add to root app module', () => {
    const tree = schematicRunner.runSchematic('ng-add', {}, appTree);

    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      // tslint:disable-next-line:trailing-comma
      /import { FormlyModule } from '@ngx-formly\/core';/
    );
    expect(content).toMatch(
      // tslint:disable-next-line:trailing-comma
      /FormlyModule.forRoot\(\)/
    );
    expect(content).toMatch(
      // tslint:disable-next-line:trailing-comma
      /import { ReactiveFormsModule } from '@angular\/forms';/
    );
    expect(content).toMatch(
      // tslint:disable-next-line:trailing-comma
      /ReactiveFormsModule,/
    );
  });

  it('should add UI theme to package.json', () => {
    const tree = schematicRunner.runSchematic('ng-add', {
      uiTheme: 'bootstrap',
    }, appTree);

    const packageJson = JSON.parse(getFileContent(tree, '/package.json'));

    expect(packageJson.dependencies['@ngx-formly/bootstrap']).toBeDefined();
  });

  it('should add UI theme to root app module', () => {
    const tree = schematicRunner.runSchematic('ng-add', {
      uiTheme: 'bootstrap',
    }, appTree);

    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      // tslint:disable-next-line:trailing-comma
      /import { FormlyBootstrapModule } from '@ngx-formly\/bootstrap';/
    );
    expect(content).toMatch(
      // tslint:disable-next-line:trailing-comma
      /FormlyBootstrapModule/
    );
  });

  it('should add to any module', () => {
    const fooModule = `${projectPath}/src/app/foo.module.ts`;

    appTree.create(fooModule, `
      import { NgModule } from '@angular/core';
      import { CommonModule } from '@angular/common';

      @NgModule({
        imports: [],
        declarations: []
      })
      export class FooModule { }
    `);

    const tree = schematicRunner.runSchematic('ng-add', {
      module: 'foo.module.ts',
    }, appTree);

    const content = tree.readContent(fooModule);

    expect(content).toMatch(
      // tslint:disable-next-line:trailing-comma
      /import { FormlyModule } from '@ngx-formly\/core';/
    );
    expect(content).toMatch(
      // tslint:disable-next-line:trailing-comma
      /FormlyModule.forRoot\(\)/
    );
    expect(content).toMatch(
      // tslint:disable-next-line:trailing-comma
      /import { ReactiveFormsModule } from '@angular\/forms';/
    );
    expect(content).toMatch(
      // tslint:disable-next-line:trailing-comma
      /ReactiveFormsModule,/
    );
  });
});
