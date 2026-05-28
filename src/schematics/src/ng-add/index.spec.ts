import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { join } from 'path';
import { createWorkspace, getTestProjectPath } from '../../utils/testing';
import { Schema } from './schema';

describe('ng-add-schematic', () => {
  const COLLECTION_PATH = join(__dirname, '../collection.json');
  const projectPath = getTestProjectPath();

  let runner: SchematicTestRunner;
  let appTree: UnitTestTree;

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', COLLECTION_PATH);
    appTree = await createWorkspace(runner, appTree);
  });

  it('should update package.json', async () => {
    const tree = await runner.runSchematic('ng-add', {}, appTree);
    const packageJson = JSON.parse(tree.get('/package.json').content.toString());

    expect(packageJson.dependencies['@angular/forms']).toBeDefined();
    expect(packageJson.dependencies['@ngx-formly/core']).toBeDefined();
  });

  it('should not add a theme by default to package.json', async () => {
    const tree = await runner.runSchematic('ng-add', {}, appTree);
    const packageJson = JSON.parse(tree.get('/package.json').content.toString());

    // @TODO: list of themes should probably be retrieved from some config file
    ['material', 'bootstrap', 'ionic', 'primeng', 'kendo', 'ng-zorro-antd'].forEach(theme => {
      expect(packageJson.dependencies[`@ngx-formly/${theme}`]).toBeUndefined();
    });
  });

  it('should skip package.json update', async () => {
    const options = { skipPackageJson: true } as Schema;
    const tree = await runner.runSchematic('ng-add', options, appTree);

    const packageJson = JSON.parse(tree.get('/package.json').content.toString());

    expect(packageJson.dependencies['@ngx-formly/core']).toBeUndefined();
  });

  it('should add to root app module', async () => {
    const tree = await runner.runSchematic('ng-add', {}, appTree);

    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      // eslint-disable-next-line:trailing-comma
      /import { FormlyModule } from '@ngx-formly\/core';/
    );
    expect(content).toMatch(
      // eslint-disable-next-line:trailing-comma
      /FormlyModule.forRoot/
    );
    expect(content).toMatch(
      // eslint-disable-next-line:trailing-comma
      /import { ReactiveFormsModule } from '@angular\/forms';/
    );
    expect(content).toMatch(
      // eslint-disable-next-line:trailing-comma
      /ReactiveFormsModule/
    );
  });

  it('should add UI theme to package.json', async () => {
    const tree = await runner.runSchematic('ng-add', { uiTheme: 'bootstrap' }, appTree);

    const packageJson = JSON.parse(tree.get('/package.json').content.toString());

    expect(packageJson.dependencies['@ngx-formly/bootstrap']).toBeDefined();
  });

  it('should add UI theme to root app module', async () => {
    const tree = await runner.runSchematic('ng-add', { uiTheme: 'bootstrap' }, appTree);

    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      // eslint-disable-next-line:trailing-comma
      /import { FormlyBootstrapModule } from '@ngx-formly\/bootstrap';/
    );
    expect(content).toMatch(
      // eslint-disable-next-line:trailing-comma
      /FormlyBootstrapModule/
    );
  });

  it('should add to any module', async () => {
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

    const tree = await runner.runSchematic('ng-add', { module: 'foo.module.ts' }, appTree);

    const content = tree.readContent(fooModule);

    expect(content).toMatch(
      // eslint-disable-next-line:trailing-comma
      /import { FormlyModule } from '@ngx-formly\/core';/
    );
    expect(content).toMatch(
      // eslint-disable-next-line:trailing-comma
      /FormlyModule.forRoot/
    );
    expect(content).toMatch(
      // eslint-disable-next-line:trailing-comma
      /import { ReactiveFormsModule } from '@angular\/forms';/
    );
    expect(content).toMatch(
      // eslint-disable-next-line:trailing-comma
      /ReactiveFormsModule/
    );
  });
});
