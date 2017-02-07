var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
     entry: './public/src/app.js',
     output: {
         path: './public/js',
         filename: 'app.bundle.js'
     },
     externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        "jquery": "jQuery"
    },
    module: {
        loaders: [{
           test: /\.js$/,
           exclude: /node_modules/,
           loader: 'babel-loader',
        },{
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract("style", "css!sass")
        }]
     },
     plugins: [
         new ExtractTextPlugin("../css/app.css")
     ]
 };
