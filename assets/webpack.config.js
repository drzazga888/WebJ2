const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
});

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
  plugins: [HtmlWebpackPluginConfig],
  devServer: {
    historyApiFallback: {
      index: '/WebJ2/'
    }
  }
}