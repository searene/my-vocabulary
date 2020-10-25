const webpack = require('webpack');
const { merge } = require('webpack-merge');

const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
    target: 'electron-main',
    entry: {
        main: './src/main/main.ts'
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
                        [
                            '@babel/preset-env',
                            { targets: 'maintained node versions' }
                        ],
                        ['@babel/preset-typescript',
                            { "onlyRemoveTypeImports": true }
                        ]
                    ],
                    plugins: [
                        ["@babel/plugin-proposal-decorators", { "legacy": true }],
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                        "babel-plugin-parameter-decorator"
                    ]
                }
            }
        ]
    },
    externals: {
        sqlite3: 'commonjs sqlite3',
        knex: 'commonjs knex',
        electron: 'commonjs electron',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ]
});
