module.exports = {
  entry: "./src/index",
  devtool: 'source-map',
  output: {
    path: __dirname + "/../bundles",
    filename: "ng2-formly.umd.js",
    libraryTarget: 'umd',
    library: 'ng2-formly'
  },
  externals: [
    /^\@angular\//,
    /^rxjs\//
  ],
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
