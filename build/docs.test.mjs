import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import ts from 'typescript';
import { marked, Slugger } from 'marked';
import { apiMenu } from './docs.mjs';

const pages = JSON.parse(readFileSync('demo/src/app/api/api.generated.json', 'utf8'));

test('documents every package entry point, with unique routes and resolvable symbol anchors', () => {
  const entries = ts.sys.readDirectory('src', ['.ts'], undefined, ['**/public_api.ts']);
  assert.equal(pages.length, entries.length + 1);
  assert.equal(new Set(pages.map((page) => page.path)).size, pages.length);
  for (const entry of entries) {
    const path = `/api/${entry.replace(/^src\//, '').replace(/\/src\/public_api\.ts$/, '')}`;
    const page = pages.find((page) => page.path === path);
    assert.ok(page, path);
    const html = marked.parse(page.content);
    const headings = [...page.content.matchAll(/^#{2,3} (.+)$/gm)].map((match) => match[1]);
    assert.equal(new Set(headings).size, headings.length, path);
    const slugger = new Slugger();
    const anchors = headings.map((name) => slugger.slug(name));
    assert.equal(new Set(anchors).size, anchors.length, path);
    for (const anchor of anchors) {
      assert.ok(html.includes(`id="${anchor}"`), `${path}#${anchor}`);
    }
    assert.doesNotMatch(page.content, /## ɵ|## _|\/Users\/|node_modules\//);
  }
  assert.equal(apiMenu(pages).flatMap((group) => group.items).length, pages.length);
});

test('omits standalone class, interface, and function declarations from API pages', () => {
  for (const page of pages) {
    assert.doesNotMatch(page.content, /```ts\n(?:class|interface|function) /, page.path);
  }
  const addons = pages.find((page) => page.path === '/api/ui/bootstrap/addons').content;
  assert.equal((addons.match(/```ts\n/g) || []).length, 2);
  for (const name of ['withFormlyWrapperAddons', 'FormlyBootstrapAddonsModule']) {
    assert.ok(addons.includes(`import { ${name} } from '@ngx-formly/bootstrap/addons';`));
  }
  assert.equal((addons.match(/\[View source\]/g) || []).length, 2);
});

test('keeps current providers, member signatures, inherited inputs, and supporting configuration types', () => {
  const core = pages.find((page) => page.path === '/api/core').content;
  assert.ok(core.includes("import { provideFormlyCore } from '@ngx-formly/core';"));
  for (const name of [
    'FormlyFormBuilder',
    'FormlyFieldConfig',
    'FormlyFormOptions',
    'TypeOption',
    'WrapperOption',
    'FormlyValidationMessagesPipe',
  ]) {
    assert.ok(core.includes(`## ${name}\n`), name);
  }
  assert.ok(core.includes('static forRoot'));
  for (const category of ['Components', 'Directives', 'Pipes', 'Services', 'Interfaces']) {
    assert.ok(core.includes(`## ${category}\n`));
  }
  assert.ok(core.includes('shareFormControl?'));
  assert.ok(core.includes('Output()'));
  const input = pages.find((page) => page.path === '/api/ui/bootstrap/input').content;
  assert.ok(input.includes('<code>field</code>'));
  assert.ok(input.includes('Input()'));
  assert.ok(marked.parse(core).includes('<td><code>build</code></td>'));
});

test('Quick Start TypeScript compiles against the current library', () => {
  const markdown = readFileSync('docs/getting-started.md', 'utf8');
  const code = [...markdown.matchAll(/```ts\n([\s\S]*?)```/g)].map((match) => match[1]).join('\n');
  assert.ok(code.includes('provideFormlyCore'));
  assert.ok(code.includes('class AppComponent'));
  const fileName = resolve('demo/src/app/quick-start.check.ts');
  const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
  const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd());
  const host = ts.createCompilerHost(options);
  const getSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (file, languageVersion, onError, shouldCreateNewSourceFile) =>
    file === fileName
      ? ts.createSourceFile(file, code, languageVersion, true)
      : getSourceFile(file, languageVersion, onError, shouldCreateNewSourceFile);
  const program = ts.createProgram([fileName], { ...options, noEmit: true }, host);
  const source = program.getSourceFile(fileName);
  const errors = [...program.getSyntacticDiagnostics(source), ...program.getSemanticDiagnostics(source)];
  assert.equal(
    errors.length,
    0,
    ts.formatDiagnosticsWithColorAndContext(errors, {
      getCurrentDirectory: () => process.cwd(),
      getCanonicalFileName: (file) => file,
      getNewLine: () => '\n',
    }),
  );
});
