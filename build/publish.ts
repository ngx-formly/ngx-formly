import { PACKAGES, exec } from './util';
import { version } from '../package.json';

const tag = version.split('+')[0].includes('-') ? 'next' : 'latest';

PACKAGES.forEach((name) => {
  const pkgPath = `${__dirname}/../dist/@ngx-formly/${name}`;

  exec(`cd ${pkgPath} && npm publish --access public --tag ${tag}`);
});
