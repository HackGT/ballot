const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HTMLWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
// const config = require('../../config.json');

const loadLandingPage = new HTMLWebpackPlugin({
    filename: 'index.html',
    template: path.resolve(__dirname, 'index.html'),
    chunks: []
});

const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    entry: __dirname + "/index.tsx",

    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "../../build/public"),
        // publicPath: config.server.url + '/app'
    },

    devtool: "source-map",

    devServer: {
        contentBase: path.join(__dirname, "../build/public"),
        port: 9000
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader?configFileName=" + path.resolve(__dirname, "tsconfig.json") },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader"},
            { test: /\.(s*)css$/, use:['style-loader', 'css-loader', 'sass-loader']}
        ]
    },

    plugins: [
        loadLandingPage,
        extractSass,
        new webpack.HotModuleReplacementPlugin(),
        new Dotenv({
            path: './.env',
            safe: false,
            systemvars: true
        }),
    ],
};