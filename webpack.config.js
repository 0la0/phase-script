const webpack = require('webpack');
const path = require('path');

const webpackConfig = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './app/main.js',
    documentation: './documentation/main.js',
  },
  output: {
    publicPath: 'scripts',
    path: path.resolve(__dirname, './dist/scripts'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },
  devtool: 'source-map',
  // plugins: [],
  optimization: {
    // splitChunks: {
    //   chunks: 'all'
    // }
  },
  module: {
    rules: [
      {
        test: /\.css$|\.html$|\.worker.js$|\.vert$|\.frag$/,
        exclude: /node_modules/,
        loader: 'raw-loader'
      }
    ]
  },
  resolve: {
    alias: {
      common: path.resolve(__dirname, 'src/common'),
      components: path.resolve(__dirname, 'src/app/components/'),
      services: path.resolve(__dirname, 'src/app/services/')
    }
  },
  devServer: {
    port: 3001
  },
  mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
};

module.exports = webpackConfig;
