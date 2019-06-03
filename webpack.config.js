const webpack = require('webpack');
const publicPath = '/static';
console.log('root path',__dirname);
module.exports = {
  mode:'development',

  entry: [
    './example/ui/index.jsx',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
    path: __dirname + '/dist',
    publicPath,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot:true,
    open: 'Google Chrome', 
    host: '0.0.0.0',
    public: '0.0.0.0:3000',
    contentBase: './dist',
    publicPath,
    historyApiFallback: true,
    proxy: {		
      '/assets': {		
          target: 'http://localhost:3000',		
          pathRewrite: {'^/assets' : '/assets'}		
       },
       '/entities':{
         target: 'http://localhost:3001'
       }	
    }
  }
};