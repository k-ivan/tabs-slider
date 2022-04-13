const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, arg) => {
  return {
    entry: [
      './src/scss/tabs.scss',
      './src/js/tabsSlider.js'
    ],
    output: {
      clean: true,
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
                postcssOptions: {
                  plugins: [
                    require('autoprefixer')
                  ]
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  outputStyle: 'expanded',
                  sourceMap: true
                }
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
      static: path.join(__dirname, 'dist'),
      compress: true,
      port: 8080,
      watchFiles: ['src/demo/index.html'],
      client: {
        overlay: true
      }
    },
    devtool: arg.mode === 'development' ? 'eval-source-map' : false,
    plugins: [
      new MiniCssExtractPlugin({
        filename: './css/tabs.css'
      }),
      new HtmlWebpackPlugin({
        template: `./src/demo/index.html`,
        minify: false,
        inject: false,
        scriptLoading: 'blocking'
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
