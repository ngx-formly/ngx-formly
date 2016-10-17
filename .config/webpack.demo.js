const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {
  context: __dirname + '/../demo',
  resolve: {
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js'],
    alias: {
      'ng2-formly': 'src/index.ts'
    }
  },
  devtool: 'source-map',
  entry: './hello.ts',
  module: {
    loaders: [
      { test: /\.ts$/, loaders: ['awesome-typescript-loader', 'angular2-template-loader'] },
      { test: /\.html$/, loader: 'raw' },
    ]
  },
  plugins: [
    new DashboardPlugin()
  ],
  output: {
    path: `${__dirname}/build/`,
    publicPath: '/build/',
    filename: 'demo.js',
  },
};
