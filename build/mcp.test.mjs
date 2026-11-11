import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, posix } from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';
import { generateMcpContent } from './mcp-content.mjs';
import ts from 'typescript';

test('indexes the published guides, API symbols and demo exports from their sources', async () => {
  const entries = await generateMcpContent();
  assert.equal(new Set(entries.map(({ id }) => id)).size, entries.length);
  const get = (id) => {
    const entry = entries.find((entry) => entry.id === id);
    assert.ok(entry, id);
    return entry;
  };
  for (const entry of entries) {
    assert.ok(readFileSync(entry.source).length, entry.source);
    assert.ok(entry.url.startsWith('https://formly.dev/'), entry.id);
    assert.doesNotMatch(JSON.stringify(entry), /\/Users\//, entry.id);
  }
  const guides = readFileSync('demo/src/app/guides/guides.content.ts', 'utf8').match(/from '.+\.md\?raw'/g);
  assert.equal(entries.filter(({ kind }) => kind === 'guide').length, guides.length);
  assert.equal(get('guide/validation').content, readFileSync('docs/validation.md', 'utf8'));
  assert.equal(get('guide/migration/v11').content, readFileSync('UPGRADE-11.0.md', 'utf8'));
  const pages = JSON.parse(readFileSync('demo/src/app/api/api.generated.json', 'utf8'));
  for (const page of pages) {
    assert.equal(get(page.path.slice(1)).content, page.content);
  }
  assert.match(get('api/core#formlyfieldconfig').content, /fieldGroup/);
  assert.doesNotMatch(get('api/core#formlyfieldconfig').content, /^### FormlyFormOptions$/m);
  const repeat = get('examples/advanced/repeating-section');
  assert.ok(repeat.files['src/app/repeat-section.type.ts']);
  assert.match(repeat.files['src/app/app.config.ts'], /RepeatTypeComponent/);
  assert.match(repeat.files['src/app/app.config.ts'], /withFormlyBootstrap/);
  assert.equal(
    get('examples/advanced/json-schema').files['src/assets/json-schema/simple.json'],
    readFileSync('demo/src/assets/json-schema/simple_json', 'utf8'),
  );
  const material = get('ui/material/datepicker');
  assert.match(material.files['src/app/app.config.ts'], /withFormlyMaterial/);
  assert.ok(material.files['src/app/app.component.html']);
  assert.match(get('ui/bootstrap/datepicker').files['src/app/additional-types.component.ts'], /datepicker/);
  for (const example of entries.filter(({ kind }) => kind === 'example')) {
    assert.ok(example.files['src/app/app.config.ts'], example.id);
    assert.ok(example.files['src/main.ts'], example.id);
    assert.ok(JSON.parse(example.files['package.json']).dependencies['@ngx-formly/core'], example.id);
    for (const [path, content] of Object.entries(example.files)) {
      if (!path.endsWith('.ts')) continue;
      const file = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
      for (const node of file.statements) {
        if (!ts.isImportDeclaration(node) || !node.moduleSpecifier.text.startsWith('.')) continue;
        const target = posix.join(posix.dirname(path), node.moduleSpecifier.text);
        assert.ok(
          ['', '.ts', '.json', '/index.ts'].some((extension) => target + extension in example.files),
          `${example.id}: missing ${target}, imported by ${path}`,
        );
      }
    }
  }
});

test('installs the MCP tarball without Angular and consumes its public JavaScript and types', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'formly-mcp-package-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const [packed] = JSON.parse(
    execFileSync(
      'npm',
      ['pack', resolve('dist/@ngx-formly/mcp'), '--json', '--pack-destination', directory, '--ignore-scripts'],
      { encoding: 'utf8' },
    ),
  );
  assert.deepEqual(packed.files.map(({ path }) => path).sort(), [
    'LICENSE',
    'README.md',
    'index.d.ts',
    'index.js',
    'package.json',
  ]);
  writeFileSync(join(directory, 'package.json'), '{"private":true,"type":"module"}');
  execFileSync('npm', ['install', join(directory, packed.filename), '--ignore-scripts', '--no-audit', '--no-fund'], {
    cwd: directory,
    stdio: 'pipe',
  });
  const lock = JSON.parse(readFileSync(join(directory, 'package-lock.json'), 'utf8'));
  assert(!Object.keys(lock.packages).some((name) => /@angular|codemirror|@ngx-formly\/core/.test(name)));
  const version = JSON.parse(readFileSync('package.json', 'utf8')).version;
  const revision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  writeFileSync(
    join(directory, 'smoke.mjs'),
    `
import { strict as assert } from 'node:assert';
import { createFormlyMcpHandler } from '@ngx-formly/mcp';
const handler = createFormlyMcpHandler({ allowedHosts: ['formly.test'], allowedOrigins: [] });
try {
  async function call(name, args) {
    const response = await handler.fetch(new Request('https://formly.test/mcp', {
    method: 'POST',
    headers: { host: 'formly.test', 'content-type': 'application/json', accept: 'application/json, text/event-stream',
      'mcp-protocol-version': '2026-07-28', 'mcp-method': 'tools/call', 'mcp-name': name },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: {
      name, arguments: args,
      _meta: { 'io.modelcontextprotocol/protocolVersion': '2026-07-28', 'io.modelcontextprotocol/clientCapabilities': {} },
    } }),
  }));
    assert.equal(response.status, 200, await response.clone().text());
    const { result } = await response.json();
    assert(!result.isError, JSON.stringify(result));
    assert.equal(result.structuredContent.version, ${JSON.stringify(version)});
    assert.equal(result.structuredContent.revision, ${JSON.stringify(revision)});
    return result;
  }
  const result = await call('formly_validate_fields', { source: '[{"props":{"required":"yes"}}]' });
  assert.equal(result.structuredContent.status, 'invalid');
  assert.equal(result.structuredContent.errorCount, 1);
  const search = await call('formly_search', { query: 'FormlyFieldConfig', limit: 1 });
  assert.equal(search.structuredContent.results[0].id, 'api/core#formlyfieldconfig');
  const lookup = await call('formly_lookup', { topic: 'api/core#formlyfieldconfig' });
  assert(lookup.structuredContent.content.includes('/blob/' + ${JSON.stringify(revision)} + '/'));
  const example = await call('formly_examples', { id: 'examples/advanced/repeating-section' });
  assert(example.structuredContent.files['src/app/repeat-section.type.ts'].includes('FieldArrayType'));
} finally { await handler.close(); }
`,
  );
  execFileSync(process.execPath, ['smoke.mjs'], { cwd: directory, stdio: 'pipe' });
  writeFileSync(
    join(directory, 'consumer.ts'),
    `
import { createFormlyMcpHandler, type FormlyMcpOptions } from '@ngx-formly/mcp';
const options: FormlyMcpOptions = { allowedHosts: ['formly.test'], allowedOrigins: [] };
const response: Promise<Response> = createFormlyMcpHandler(options).fetch(new Request('https://formly.test/mcp'));
void response;
`,
  );
  execFileSync(
    process.execPath,
    [
      resolve('node_modules/typescript/bin/tsc'),
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      '--module',
      'nodenext',
      '--target',
      'es2022',
      'consumer.ts',
    ],
    { cwd: directory, stdio: 'pipe' },
  );
});

test('builds a Netlify function with preview origins available after the build environment is gone', async (t) => {
  const path = 'dist/functions/mcp.mjs';
  const original = readFileSync(path);
  t.after(() => writeFileSync(path, original));
  execFileSync(process.execPath, ['build/mcp.mjs'], {
    env: {
      ...process.env,
      URL: 'https://formly.test',
      DEPLOY_URL: 'https://unique--formly.netlify.app',
      DEPLOY_PRIME_URL: 'https://deploy-preview-42--formly.netlify.app',
    },
    stdio: 'pipe',
  });
  const { default: mcp, config } = await import(pathToFileURL(resolve(path)));
  assert.equal(config.path, '/mcp');
  assert.equal(config.rateLimit.windowLimit, 60);
  for (const host of [
    'formly.test',
    'unique--formly.netlify.app',
    'deploy-preview-42--formly.netlify.app',
    'other.netlify.app',
  ]) {
    const response = await mcp(
      new Request(`https://${host}/mcp`, {
        method: 'OPTIONS',
        headers: { host, origin: `https://${host}` },
      }),
      { site: { url: 'https://formly.test' } },
    );
    assert.equal(response.status, host === 'other.netlify.app' ? 403 : 204);
  }
});
