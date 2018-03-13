const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './client/index.html',
    filename: 'index.html',
    inject: 'body'
});

const url = new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }
});

const config = {
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
            reasons: true,
            children: false,
            source: false,
            errors: true,
            errorDetails: true,
            warnings: true,
            publicPath: false
        }
    },
    module: {
        loaders: [
            {test: /\.css/, loader: "style-loader!css-loader"},
            {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
            {test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/},
            {
                test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
                loader: 'file-loader?name=[name].[ext]'  // <-- retain original file name
            },
            {
                test: /\.(jpg|png|svg|ico)$/,
                loader: 'file-loader?name=[name].[ext]&mimetype=image/png',
                include: "../../static/img"
            }
        ]
    },
    plugins: [HtmlWebpackPluginConfig, url]
};


function go(env) {
    return config;
}

module.exports = go();

