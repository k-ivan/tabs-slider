const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, arg) => {
  return {
    entry: [
      './src/scss/tabs.scss',
      './src/js/tabsSlider.js'
    ],
    output: {
      filename: './js/tabsSlider.js',
      library: 'TabsSlider',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    module: {
      rules: [
        {
          test: /\.(sass|scss)$/,
          include: path.resolve(__dirname, 'src/scss'),
          use: ExtractTextPlugin.extract({
            use: [{
              loader: 'css-loader',
              options: {
                sourceMap: true,
                minimize: true,
                url: false
              }
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
            ]
          })
        },
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src/js'),
          use: {
            loader: 'babel-loader',
            options: {
              presets: 'env'
            }
          }
        }
      ]
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      overlay: true,
      port: 8080
    },
    devtool: arg.mode === 'development' ? 'eval-source-map' : false,
    plugins: [
      new ExtractTextPlugin({
        filename: './css/tabs.css'
      }),
      new webpack.BannerPlugin({
        test: /\.js$/,
        banner: '@author ivan.kuzmichov@gmail.com\n' +
                '@source https://github.com/k-ivan/tabs-slider\n' +
                '@description Simple tabs slider in pure JavaScript\n' +
                '@license MIT'
      })
    ]
  };
};
