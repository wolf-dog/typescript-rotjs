module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  module: {
    rules:[{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'app.js'
  }
};
