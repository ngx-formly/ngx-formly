var pkg     = require('../package.json');
var path    = require('path');
var Builder = require('systemjs-builder');
var name    = pkg.name;

var builder = new Builder();
var config = {
  baseURL: '.',
  transpiler: 'typescript',
  typescriptOptions: {
    module: 'cjs'
  },
  map: {
    typescript: './node_modules/typescript/lib/typescript.js',
    '@angular': './node_modules/@angular',
    rxjs: './node_modules/rxjs'
  },
  paths: {
    '*': '*.js'
  },
  meta: {
    './node_modules/@angular/*': { build: false },
    './node_modules/rxjs/*': { build: false }
  }
};

builder.config(config);

builder
.buildStatic('lib/index', path.resolve(__dirname, '../bundles/', name + '.js'), {sourceMaps: true, format: 'umd'})
.then(function() {
  console.log('Build complete.');
})
.catch(function(err) {
  console.log('Error', err);
});
