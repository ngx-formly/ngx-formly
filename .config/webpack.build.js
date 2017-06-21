const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');

module.exports = {
  entry: './src/index',
  devtool: 'source-map',
  output: {
    path: __dirname + '/../bundles',
    filename: 'ng-formly.umd.js',
    libraryTarget: 'umd',
    library: 'ng-formly'
  },
  externals: [
    /^\@angular\//,
    /^rxjs\//
  ],
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['awesome-typescript-loader?declaration=false'],
      }
    ]
  },
  plugins: [
    new ModuleConcatenationPlugin(),
  ]
};
