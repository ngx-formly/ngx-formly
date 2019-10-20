import { exec } from './util';
import { publish } from 'gh-pages';
import { copyFileSync } from 'fs';
import { copySync } from 'fs-extra';
import { join } from 'path';

const basePath = join(process.cwd(), 'dist/app');
const branch =
  process.env.TRAVIS_BRANCH ||
  exec(`git branch | sed -n '/\* /s///p'`, {})
    .toString()
    .trim();
const isStableVersion = branch === 'v5';

// build demo
exec(
  `rm -rf dist/app && ng build --prod --deploy-url=/ngx-formly/${branch}/ --base-href=/ngx-formly/${
    isStableVersion ? '' : branch
  } --output-path=dist/app/${branch}`,
);

copyFileSync(join(basePath, branch, 'index.html'), join(basePath, branch, '404.html'));
if (isStableVersion) {
  copySync(join(basePath, branch, 'assets'), join(basePath, 'assets'));
  copyFileSync(join(basePath, branch, 'favicon.ico'), join(basePath, 'favicon.ico'));
  ['404', 'index'].forEach(page => copyFileSync(join(basePath, branch, 'index.html'), join(basePath, `${page}.html`)));
}

publish(basePath, {
  only: branch,
  repo: 'https://' + process.env.GH_TOKEN + '@github.com/ngx-formly/ngx-formly.git',
});
