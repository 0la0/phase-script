var path = require('path');

module.exports = {
  entry: './src/app/components/entrypoint/app',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.css$|\.html$|\.worker.js$/,
        exclude: /node_modules/,
        loaders: ['raw-loader']
      }
    ]
  }
};
