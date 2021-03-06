const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
    target: 'electron-renderer',
    entry: {
        app: {
            import: "./src/renderer/App.tsx",
            filename: "./app.js"
        },
        googleImage: {
            import: "./src/renderer/ipc/GoogleImage.ts",
            filename: "./ipc/google-image.js"
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    babelrc: false,
                    presets: [
                        '@babel/preset-typescript',
                        '@babel/preset-react'
                    ],
                    plugins: [
                        ["@babel/plugin-proposal-decorators", { "legacy": true }],
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                    ],
                }
            },
            {
                test: /\.less$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            disable: true
                        }
                    }
                ]
            },
            // Font files
            {
                test: /\.(woff|woff2|ttf|otf|eot)$/,
                loader: 'file-loader',

                options: {
                    name: '[name].[ext]',
                    outputPath: 'css/',
                    esModule: false,
                    publicPath: (url) => {
                        return './css/' + url;
                    }
                }
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/template.html"
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        // new CopyPlugin({
        //     patterns: [{
        //         from: "src/renderer/ipc/google-image.js",
        //         to: "ipc/google-image.js"
        //     }]
        // }),
    ]
});
