var path = require('path');
var config = {
  devtool: 'source-map',
  entry: {
    index: './src/components/index.js',
    store: './src/store/index.js'
  },
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
    extensions: ['*', '.js', '.jsx']
  },
  externals: {
    immutable: {
      root: 'Immutable',
      commonjs: 'immutable',
      commonjs2: 'immutable',
      amd: 'immutable',
      umd: 'immutable'
    },
    'joy-query-box': {
      root: 'JoyQueryBox',
      commonjs: 'joy-query-box',
      commonjs2: 'joy-query-box',
      amd: 'joy-query-box',
      umd: 'joy-query-box'
    },
    'lodash.throttle': {
      root: 'throttle',
      commonjs: 'lodash.throttle',
      commonjs2: 'lodash.throttle',
      amd: 'lodash.throttle',
      umd: 'lodash.throttle'
    },
    'prop-types': {
      root: 'PropTypes',
      commonjs: 'prop-types',
      commonjs2: 'prop-types',
      amd: 'prop-types',
      umd: 'prop-types'
    },
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      umd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom',
    },
    'react-datepicker': {
      root: 'ReactDatePicker',
      commonjs: 'react-datepicker',
      commonjs2: 'react-datepicker',
      amd: 'react-datepicker',
      umd: 'react-datepicker'
    },
    'react-draggable': {
      root: 'Draggable',
      commonjs: 'react-draggable',
      commonjs2: 'react-draggable',
      amd: 'react-draggable'
    },
    'react-virtualized': {
      root: 'react-virtualized',
      commonjs: 'react-virtualized',
      commonjs2: 'react-virtualized',
      amd: 'react-virtualized'
    }
  },

  stats: {
    all: true,
    modules: true,
    maxModules: 0,
    errors: true,
    warnings: true,
    moduleTrace: true,
    errorDetails: true
  },
  output: {
    path: path.join(__dirname, './lib'),
    filename: '[name].js',
    library: 'joy-ui',
    libraryTarget: 'commonjs2'
  },
}

module.exports = config;
