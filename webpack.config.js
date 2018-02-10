const path = require('path');

module.exports = {
  entry: './src/entrypoints',
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
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/app/components/'),
      services: path.resolve(__dirname, 'src/app/services/')
    }
  }
};
