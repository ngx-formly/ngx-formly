/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { join } from 'path';
import { createWorkspace, getTestProjectPath } from '../../utils/testing';
import { Schema as ComponentOptions } from './schema';
import { getFileContent } from '@schematics/angular/utility/test';
import { ChangeDetection } from '@schematics/angular/component/schema';

// tslint:disable:max-line-length
xdescribe('Component Schematic', () => {
  const collectionPath = join(__dirname, '../collection.json');
  const defaultOptions: ComponentOptions = {
    name: 'foo',
    path: 'src/app',
    inlineStyle: false,
    inlineTemplate: false,
    changeDetection: ChangeDetection.Default,
    module: undefined,
    export: false,
    project: 'bar',
  };
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);
  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should create a component', async () => {
    const tree = await schematicRunner
      .runSchematicAsync('wrapper', { ...defaultOptions }, appTree)
      .toPromise();

    const files = tree.files;
    expect(files.indexOf(`${projectPath}/src/app/foo/foo.component.css`)).toBeGreaterThanOrEqual(0);
    expect(files.indexOf(`${projectPath}/src/app/foo/foo.component.html`)).toBeGreaterThanOrEqual(0);
    expect(files.indexOf(`${projectPath}/src/app/foo/foo.component.spec.ts`)).toBeGreaterThanOrEqual(0);
    expect(files.indexOf(`${projectPath}/src/app/foo/foo.component.ts`)).toBeGreaterThanOrEqual(0);

    const moduleContent = getFileContent(tree, `${projectPath}/src/app/app.module.ts`);

    expect(moduleContent).toMatch(/import.*Foo.*from '.\/foo\/foo.component'/);
    expect(moduleContent).toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+FooComponent\r?\n/m);
  });

  xit('should add wrapper to FormlyModule config', async () => {
    const tree = await schematicRunner
      .runSchematicAsync('wrapper', { ...defaultOptions }, appTree)
      .toPromise();

    const moduleContent = getFileContent(tree, `${projectPath}/src/app/app.module.ts`);

    expect(moduleContent).toContain(`wrappers: [
      { name: 'foo', component: FooWrapperComponent },
    ],`);
  });
});
