var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist/*']),
        new HtmlWebpackPlugin({
            hash: true,
            template: './index.html',
            filename: './index2.html' //relative to root of the application
        })
   ],
    stats: {
        colors: true
    }
};