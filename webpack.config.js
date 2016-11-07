var webpack = require('webpack');
var path = require('path');

module.exports = {
    // 页面入口文件配置
    entry : { 
        index : path.resolve(__dirname, './index.js'),
       
    },
    
    // 入口文件输出配置
    output : {
        path : __dirname,
        filename : 'bundle.js'
    },
    module: {
        // 加载器配置
        loaders: [
        {
            test: /\.js$/,
            loader: 'babel'
        },
        {
            test: /\.jsx$/,
            loader: 'babel'
        },
        {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }
        ]      
    },
    // 其他解决方案配置
    resolve: {
        extensions: ['', '.js', '.jsx', '.css', '.json'],
    },
 
}