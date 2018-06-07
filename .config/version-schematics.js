const fs = require('fs');
// Schematics is NOT an `ng-package` and therefore requires a valid semver version
const packagePath = 'dist/@ngx-formly/schematics';

package = fs.readFileSync(`${packagePath}/package.json`, 'utf8');
fs.writeFileSync(`${packagePath}/package.json`, package.replace(/0\.0\.0/g, 'FORMLY-VERSION'));
