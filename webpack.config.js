'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack           = require('webpack');

const PRODUCTION = process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production';

module.exports = {
  entry: ['whatwg-fetch', './app/index.jsx'],
  output: {
    path: `${__dirname}/public`,
    filename: PRODUCTION ? '[name].[contenthash].js' : '[name].[fullhash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.jsx', '.js']
  },
  devtool: PRODUCTION ? 'source-map' : 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    port: 9898,
    static: 'public/',
  },
  mode: PRODUCTION ? 'production' : 'none',
  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.scss$/, use: ['style-loader', { loader: 'css-loader', options: { url: false } }, 'sass-loader'] }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './app/index.html', filename: 'index.html', inject: 'body' }),
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) || 'undefined',
      'process.env.VERSION': JSON.stringify(process.env.VERSION || 'development')
    }),
    new Webpack.ProvidePlugin({ React: 'react' })
  ]
};
