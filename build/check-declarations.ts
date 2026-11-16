import { strict as assert } from 'assert';
import * as fs from 'fs';
import { tmpdir } from 'os';
import { join, relative, resolve } from 'path';
import * as ts from 'typescript';
import { PACKAGES } from './util';

const consumerDir = fs.mkdtempSync(join(tmpdir(), 'formly-declarations-'));
const packagesDir = join(consumerDir, 'node_modules', '@ngx-formly');
const errors: string[] = [];

try {
  fs.mkdirSync(join(consumerDir, 'node_modules'));
  // Resolve through package exports as a consumer would, without the repository's path aliases.
  fs.symlinkSync(resolve('dist/@ngx-formly'), packagesDir, 'junction');

  for (const name of PACKAGES.filter((name) => name !== 'schematics')) {
    const files = ts.sys.readDirectory(join(packagesDir, name), ['.d.ts']);
    assert(files.length, `No declarations found for @ngx-formly/${name}; run npm run build first.`);

    for (const file of files) {
      const { importedFiles } = ts.preProcessFile(fs.readFileSync(file, 'utf8'));
      for (const { fileName } of importedFiles.filter(({ fileName }) => fileName.startsWith('@ngx-formly/'))) {
        const { resolvedModule } = ts.resolveModuleName(
          fileName,
          file,
          { module: ts.ModuleKind.Preserve, moduleResolution: ts.ModuleResolutionKind.Bundler },
          ts.sys,
        );
        if (!resolvedModule) {
          errors.push(`${relative(packagesDir, file)}: Cannot find module '${fileName}'.`);
        }
      }
    }
  }

  assert.equal(errors.length, 0, errors.join('\n'));
  console.log('Built Formly declaration imports resolve through package exports.');

  const consumerFile = join(consumerDir, 'consumer.ts');
  fs.copyFileSync('build/fixtures/public-api-compatibility.ts', consumerFile);
  const program = ts.createProgram([consumerFile], {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.Preserve,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    skipLibCheck: true,
    noEmit: true,
    types: [],
  });
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(
    diagnostics.length,
    0,
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: () => consumerDir,
      getCanonicalFileName: (file) => file,
      getNewLine: () => '\n',
    }),
  );
  console.log('Built Formly public APIs accept existing consumer mocks and events.');
} finally {
  fs.rmSync(consumerDir, { recursive: true, force: true });
}
