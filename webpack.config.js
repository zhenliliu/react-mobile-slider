const path = require('path')
module.exports = {
  mode: "production",
  entry: {
    index: path.resolve(__dirname, './src/index.js')
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, './lib'),
    publicPath: path.resolve(__dirname, './lib')
  },
  module: {
    rules: [
      {test: /.js$/, use: ["babel-loader"]},
      {test: /.less$/, use: ["style-loader", "css-loader","less-loader"]},
    ]
  }
}