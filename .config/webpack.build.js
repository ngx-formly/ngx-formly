function libExternal(root, ns) {
  return {root: root, commonjs: ns, commonjs2: ns, amd: ns};
}

module.exports = {
  entry: "./src/index",
  devtool: 'source-map',
  output: {
    path: __dirname + "/../bundles",
    filename: "ng2-formly.umd.js",
    libraryTarget: 'umd',
    library: 'ng2-formly'
  },
  externals: {
    '@angular/core': libExternal(['ng', 'core'], '@angular/core'),
    '@angular/common': libExternal(['ng', 'common'], '@angular/common'),
    '@angular/forms': libExternal(['ng', 'forms'], '@angular/forms'),
    'rxjs/Rx': libExternal('Rx', 'rxjs/Rx'),
    'rxjs/Subject': libExternal(['Rx', 'Subject'], 'rxjs/Subject'),
    'rxjs/add/operator/debounceTime': libExternal(['Rx', 'Observable', 'prototype'], 'rxjs/add/operator/debounceTime'),
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
      }
    ]
  }
};
