
const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const uglifyjs = require('uglifyjs-webpack-plugin');
module.exports = {
    module: {
      rules: [
        {
            test: /\.js$/,
            use: {
                loader: 'eslint-loader',
                options: {
                    formatter: require('eslint-friendly-formatter') // 默认的错误提示方式
                }
            },
            enforce: 'pre', // 编译前检查
            exclude: /node_modules/, // 不检测的文件
            include: [__dirname + '/src'], // 要检查的目录
        },
        {
            test: /\.js$/,
            exclude: /node_modules/, 
            loader: "babel-loader"
        }
      ],
    },
    plugins: [
        new FlowBabelWebpackPlugin({
            flowArgs: ['check']
        }),
        new HtmlWebpackPlugin({
            title: 'Custom template',
            template: './src/index.html', //指定要打包的html路径和文件名
            filename:'./index.html' //指定输出路径和文件名
          }),
        new uglifyjs(), //压缩js
    ],
};