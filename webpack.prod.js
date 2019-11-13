'use strict';

const glob = require('glob');
const path = require('path');
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')

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
                // chunks: ['vendors', pageName],
                chunks: ['commons', pageName],
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
        filename: '[name]_[chunkhash:8].js'
    },
    mode: 'none',
    // mode: 'production',
    // mode: 'development',
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    'eslint-loader'
                ]

            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: "px2rem-loader",
                        options: {
                            remUnit: 75,
                            remPrecision: 8
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')({
                                    overrideBrowserslist: ["last 2 version", ">1%", "IOS 7"]
                                })
                            ]
                        }
                    },
                    {
                        loader: "px2rem-loader",
                        options: {
                            remUnit: 75,
                            remPrecision: 8
                        }
                    }
                ]
            },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/,
            cssProcessor: require('cssnano')
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackExternalsPlugin({
            externals: [
                {
                    module: 'react',
                    entry: 'http://114.116.211.82/nccloud/resources/platform/react.js',
                    global: 'React'
                },
                {
                    module: 'react-dom',
                    entry: 'http://114.116.211.82/nccloud/resources/platform/react-dom.js',
                    global: 'ReactDOM'
                }
            ]
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ].concat(htmlWebpackPlugins),
    // devtool: 'inline-source-map'
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 test: /(react)|(react-dom)/,
    //                 name: 'vendors',
    //                 chunks: 'all'
    //             }
    //         }
    //     }
    // }
    optimization: {
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 3
                }
            }
        }
    }
};