const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },

    module: {
        rules: [
            {
                test: /\.css$/, // For CSS files
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(js)$/, // For JavaScript files
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/, // For image files
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',  // Path to your HTML template
            filename: 'index.html'
        })
    ],
    mode: 'development', // Use 'production' for minified output
    devServer: {
        static: './dist', // Where dev server will look for static files, not compiled at runtime
        open: true // Open the page in browser
    }
};