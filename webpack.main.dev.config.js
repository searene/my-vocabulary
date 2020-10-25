const { merge } = require('webpack-merge');
const NodemonPlugin = require('nodemon-webpack-plugin');

const baseConfig = require('./webpack.main.config');

module.exports = merge(baseConfig, {
  plugins: [
    new NodemonPlugin(),
  ],
});
