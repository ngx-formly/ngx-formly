import { strict as assert } from 'node:assert';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const require = createRequire(import.meta.url);
require('ts-node').register({ project: fileURLToPath(new URL('./tsconfig.json', import.meta.url)) });
const util = require('./util.ts');
const pkg = require('../package.json');

for (const [version, tag] of [
  ['11.1.0-rc.0', 'next'],
  ['11.1.0-rc.1+build.2', 'next'],
  ['11.1.0', 'latest'],
  ['11.1.0+build-2', 'latest'],
]) {
  test(`publishes every package at ${version} with the ${tag} tag`, (t) => {
    const original = pkg.version;
    pkg.version = version;
    t.after(() => {
      pkg.version = original;
      delete require.cache[require.resolve('./publish.ts')];
    });
    const exec = t.mock.method(util, 'exec', () => {});

    require('./publish.ts');

    assert.deepEqual(
      exec.mock.calls.map(({ arguments: args }) => args),
      util.PACKAGES.map((name) => [
        `cd ${fileURLToPath(new URL('.', import.meta.url))}../dist/@ngx-formly/${name} && npm publish --access public --tag ${tag}`,
      ]),
    );
  });
}
