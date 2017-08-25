const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');
const path = require('path');

module.exports = {
  entry: {
    app: './src/bootstrap.ts',
    vendor: ['@angular/core'],
  },
  devtool: 'source-map',
  context: path.join(__dirname, '..', 'demo'),
  resolve: {
    extensions: ['.ts', '.webpack.js', '.web.js', '.js'],
    alias: {
      '@ngx-formly/core':  path.join(__dirname, '..', 'src/core'),
      '@ngx-formly/bootstrap':  path.join(__dirname, '..', 'src/ui-bootstrap'),
    },
  },
  module: {
    rules: [
      { test: /\.ts$/, use: ['awesome-typescript-loader?declaration=false', 'angular2-template-loader'] },
      { test: /\.html$/, use: ['raw-loader'] },
    ]
  },
  plugins: [
    new DashboardPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js',
    }),
  ],
  output: {
    path: path.join(__dirname, '..', 'build'),
    publicPath: '/build/',
    filename: 'demo.js',
  },
};
