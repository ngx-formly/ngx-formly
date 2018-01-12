const webpack = require('webpack');
const path = require('path');

module.exports = {
  output: {},
  resolve: {
    extensions: ['.ts', '.webpack.js', '.web.js', '.js'],
    alias: {
      '@ngx-formly/core': path.join(__dirname, '..', 'src/core'),
      '@ngx-formly/bootstrap': path.join(__dirname, '..', 'src/ui-bootstrap'),
      '@ngx-formly/material': path.join(__dirname, '..', 'src/ui-material'),
      '@ngx-formly/ionic': path.join(__dirname, '..', 'src/ui-ionic'),
    },
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve('src'),
        use: ['istanbul-instrumenter-loader'],
        exclude: [/\.spec\.ts$/, /node_modules/]
      },
      {
        test: /\.ts$/,
        use: ['awesome-typescript-loader?inlineSourceMap=true&configFileName=tsconfig-spec.json&sourceMap=false&declaration=false', 'angular2-template-loader'],
        exclude: [/node_modules/]
      },
      { test: /\.html$/, use: ['raw-loader'] },
    ]
  },
  plugins: [],
};
