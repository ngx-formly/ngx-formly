const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {},
  output: {},
  resolve: {
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js'],
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test: /\.ts$/,
        include: path.resolve('src'),
        loader: 'istanbul-instrumenter-loader',
        exclude: [/\.spec\.ts$/, /node_modules/]
      },
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader?inlineSourceMap=true&sourceMap=false', 'angular2-template-loader'],
        exclude: [/node_modules/]
      },
      { test: /\.html$/, loader: 'raw' },
    ]
  },
  plugins: [],
};
