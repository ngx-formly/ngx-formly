import { PACKAGES, exec } from './util';

PACKAGES.forEach((name) => {
  exec(`npm dist-tag add @ngx-formly/${name}@7.0.0 latest`);
});