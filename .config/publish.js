const execSync = require('child_process').execSync,
  packages = [
    'core',
    'bootstrap',
  ];

packages.map(package => {
    const packagePath = `${__dirname}/../dist/${package}`;

    execSync(`cd ${packagePath} && npm publish`);
});
