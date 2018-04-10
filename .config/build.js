const fs = require("fs"),
  execSync = require('child_process').execSync,
  packages = [
    'core',
    'bootstrap',
    'material',
    'ionic'
  ];

// update `FORMLY-VERSION` in package.json for all sub-packages
const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
packages.map(package => {
  const packagePath = `dist/${package}`;

  execSync(`cp README.md ${packagePath}`);

  package = fs.readFileSync(`${packagePath}/package.json`, 'utf8');
  fs.writeFileSync(`${packagePath}/package.json`, package.replace(/FORMLY-VERSION/g, version));
});
