const execSync = require('child_process').execSync,
  packages = [
    'core',
    'bootstrap',
    'material',
    'ionic',
    'primeng',
  ];

packages.map(package => {
  const packagePath = `${__dirname}/../dist/${package}`;

  execSync(`cd ${packagePath} && npm publish --tag next`);
});
