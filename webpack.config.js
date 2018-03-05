const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: `${__dirname}/index.html`,
    filename: 'index.html',
    inject: 'body',
});
const webpack = require('webpack');
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const Path = require('path');
const poststylus = require('poststylus');
const autoprefixer = require('autoprefixer');

let pathsToClean = [
  'demo'
];

let cleanOptions = {}

module.exports = {
    entry: {
        app: [
          'babel-polyfill',
          './js/index.js'
        ],
    },
    output: {
        path: `${__dirname}/demo`,
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-0'],
                    plugins: ["transform-async-to-generator"]
                },
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.less$/,
                loader: "style!css!less"
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
        ],
        rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['es2015', 'stage-0']
                }
              }
            },          
            {
              test: /\.styl$/,
              exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'stylus-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            {
              test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
              use: [
                {
                  loader: 'file-loader'
                }
              ]
            }
        ]
    },
    devServer: {
        inline: true,
        port: 8008,
    },
    plugins: [
        HTMLWebpackPluginConfig,
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: true
        //     }
        // }),
        new CopyWebpackPlugin([
          { from:'js', to:'js' }, 
          { from:'images', to:'images' }
        ]),
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new webpack.LoaderOptionsPlugin({
          options: {
            stylus: {
              use: [poststylus([ 'autoprefixer', 'rucksack-css' ])]
            }
          }
        })
    ],
    resolve: {
        alias: {
            // 'images': Path.resolve(__dirname, '../images'),
            // 'data': Path.resolve(__dirname, '../data'),
            // 'vdata': Path.resolve('/dev_keith/infographics/mining/vdata'),
        }
    },
};