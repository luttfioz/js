const path = require('path');

module.exports = {
  mode: 'development',
  //entry: './app.js',
  entry: ["./app.js"],
  output: {
    filename: 'bundle.js'
  }, 
  watch: true
}