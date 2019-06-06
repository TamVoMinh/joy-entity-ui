const webpack = require('webpack');
const publicPath = '/static';
const path = require('path');
console.log('root path',__dirname);
module.exports = {
  mode:'development',

  entry: [
    './example/ui/index.jsx',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server'
  ],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', 
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
            "style-loader", 
            "css-loader", 
            "sass-loader"
        ]
      }
    ]
  },
  resolve: {
    modules: ["src", "node_modules"],
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'example','dist'),
    publicPath,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot:true,
    open: true, 
    host: '0.0.0.0',
    port: 3000,
    public: 'localhost:3000',
    contentBase: './example/public',
    publicPath,
    historyApiFallback: true,
    proxy: {
       '/entities':{
         target: 'http://localhost:3001'
       }	
    }
  }
};