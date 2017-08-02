const BabiliPlugin = require( "babili-webpack-plugin" ),
      { join } = require( "path" );
module.exports = {
    entry: "./src/html-import.js",
    output: {
			path: join( __dirname, "/dist/" ),
			filename: "html-import.min.js",
      publicPath: "/"
    },

    module: {
			rules: [
        {
          test: /.js$/,
          exclude: /node_modules/,
          use: [{
            loader: "babel-loader",
            options: {
              presets: [ "es2017" ]
            }
          }]
        }
			]
		},

    plugins: [
      new BabiliPlugin()
    ]
};