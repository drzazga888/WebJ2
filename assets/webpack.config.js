const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log('API calls will point to', process.env.SERVER_PATH || '/');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('../WebContent'),
    filename: 'bundle.js',
    publicPath: '/webj2/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          { loader: 'url-loader' }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          { loader: 'url-loader' }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      SERVER_PATH: JSON.stringify(process.env.SERVER_PATH)
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body'
    })
  ],
  devServer: {
    historyApiFallback: {
      index: '/webj2/'
    }
  }
}