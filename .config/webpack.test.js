const webpack = require('webpack');

module.exports = {
  entry: "./src/index",
  resolve: {
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js'],
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.ts$/, loaders: ['awesome-typescript-loader', 'angular2-template-loader'] },
      { test: /\.html$/, loader: 'raw' },
    ]
  },
  plugins: [],
};
