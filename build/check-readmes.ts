import { strict as assert } from 'assert';
import * as fs from 'fs';
import { PACKAGES } from './util';

const { projects } = JSON.parse(fs.readFileSync('angular.json', 'utf8'));

for (const name of PACKAGES) {
  const packageName = `@ngx-formly/${name}`;
  const sourceDir = name === 'schematics' ? 'src/schematics' : projects[packageName].root;
  const source = fs.readFileSync(`${sourceDir}/README.md`, 'utf8');
  const built = fs.readFileSync(`dist/@ngx-formly/${name}/README.md`, 'utf8');

  assert(source.startsWith(`# ${packageName}\n`), `${packageName} needs its own README heading.`);
  assert.equal(built, source, `${packageName} must publish its own README.`);
}

console.log('All built Formly packages contain their package-specific README.');
