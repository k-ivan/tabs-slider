const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
      libraryExport: 'default',
      umdNamedDefine: true
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('autoprefixer')
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                outputStyle: 'expanded',
                sourceMap: true
              }
            }

          ],
        },
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src/js'),
          use: {
            loader: 'babel-loader'
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
      new MiniCssExtractPlugin({
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
