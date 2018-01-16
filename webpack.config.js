const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './client/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry: './client/index.js',
    output: {
        path: './dist',
        filename: 'index_bundle.js'
    },
    devServer: {
        stats: {
            colors: true,
            hash: false,
            version: false,
            timings: false,
            assets: false,
            chunks: false,
            modules: false,
            reasons: false,
            children: false,
            source: false,
            errors: false,
            errorDetails: false,
            warnings: false,
            publicPath: false
        }
    },
    module: {
        loaders: [
            {test: /\.css/, loader: "style-loader!css-loader"},
            {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
            {test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/}
        ]
    },
    plugins: [HtmlWebpackPluginConfig]
};
