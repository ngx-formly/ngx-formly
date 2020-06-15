import { PACKAGES, exec } from './util';

PACKAGES.forEach((name) => {
  const pkgPath = `${__dirname}/../dist/@ngx-formly/${name}`;

  exec(`cd ${pkgPath} && npm publish --tag next --access public`);
});
