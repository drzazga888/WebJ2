const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FontelloPlugin = require("fontello-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('../WebContent'),
    filename: 'bundle.js',
    publicPath: '/WebJ2/'
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
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    new FontelloPlugin({
      config: require('./src/fontello.config.json')
    })
  ],
  devServer: {
    historyApiFallback: {
      index: '/WebJ2/'
    }
  }
}