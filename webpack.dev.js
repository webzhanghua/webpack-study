'use strict';

const glob = require('glob');
const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const setMpa = () => {
    const entry = {}
    const htmlWebpackPlugins = []
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))

    Object.keys(entryFiles).map((index) => {
        const entryFile = entryFiles[index]
        const match = entryFile.match(/src\/(.*)\/index.js/)
        const pageName = match && match[1]
        entry[pageName] = entryFile
        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template: path.join(__dirname, `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: [pageName],
                inject: true,
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserverLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: false
                }
            })
        )
    })
    return {
        entry,
        htmlWebpackPlugins
    }
}
let { entry, htmlWebpackPlugins } = setMpa()

module.exports = {
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    watch: true,
    // mode: 'production',
    mode: 'development',
    module: {
        rules: [
            {
                test: /.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            // {
            //     test: /.(png|jpg|gif|jpeg)$/,
            //     use: 'file-loader'
            // },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin()
    ].concat(htmlWebpackPlugins),
    devServer: {
        contentBase: './dist',
        hot: true
    },
    devtool: 'source-map'
};