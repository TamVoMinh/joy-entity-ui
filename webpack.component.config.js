var path = require('path');
var webpack = require('webpack');

var config =  {
  devtool: 'source-map',
  entry: './src/lib/index.jsx',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.pegjs$/i,
        use: 'raw-loader',
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
   externals: {
    immutable: {
      root: 'immutable',
      commonjs: 'immutable',
      commonjs2: 'immutable',
      amd: 'immutable'
    },
    'joy-query-box': {
      root: 'joy-query-box',
      commonjs: 'joy-query-box',
      commonjs2: 'joy-query-box',
      amd: 'joy-query-box'
    },
    'lodash.throttle': {
      root: 'lodash.throttle',
      commonjs: 'lodash.throttle',
      commonjs2: 'lodash.throttle',
      amd: 'lodash.throttle'
    },
    'prop-types': {
      root: 'prop-types',
      commonjs: 'prop-types',
      commonjs2: 'prop-types',
      amd: 'prop-types'
    },
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom'
    },
    'react-datepicker': {
      root: 'react-datepicker',
      commonjs: 'react-datepicker',
      commonjs2: 'react-datepicker',
      amd: 'react-datepicker'
    },
    'react-router-dom': {
      root: 'react-router-dom',
      commonjs: 'react-router-dom',
      commonjs2: 'react-router-dom',
      amd: 'react-router-dom'
    },
    'react-draggable': {
      root: 'react-draggable',
      commonjs: 'react-draggable',
      commonjs2: 'react-draggable',
      amd: 'react-draggable'
    },
    'react-virtualized': {
      root: 'react-virtualized',
      commonjs: 'react-virtualized',
      commonjs2: 'react-virtualized',
      amd: 'react-virtualized'
    },
    'js-base64': {
      root: 'js-base64',
      commonjs: 'js-base64',
      commonjs2: 'js-base64',
      amd: 'js-base64'
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
    filename: 'index.js',
    library: 'joy-entity-ui',
    libraryTarget: 'commonjs2'
  },
}

module.exports = config;
