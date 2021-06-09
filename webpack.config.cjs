const TerserPlugin = require("terser-webpack-plugin");
const terserOptions = {
     mangle: { properties: true }
};

module.exports = {
     entry: './src/index.js',
     output: {
          path: __dirname + '/public/dist',
          filename: 'bundle.js'
     },
     resolve: {
          alias: { 'module': __dirname + "/node_modules" }
     },
     optimization: {
          minimizer: [
               new TerserPlugin({
                    terserOptions: {
                         builtins: false
                    }
               })
          ]
     },
     module: {
          rules: [{
               test: /\.m?js$/,
               exclude: /(node_modules|bower_components)/,
               use: {
                    loader: 'babel-loader',
                    options: {
                         plugins: ["@babel/plugin-transform-runtime"],
                         presets: ['@babel/preset-env']
                    }
               }
          }, {
               test: /\.css$/i,
               use: ["style-loader", "css-loader"],
          }, {
               test: /\.txt$/i,
               use: 'raw-loader',
          }, {
               test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
               use: [{
                    loader: 'file-loader',
                    options: {
                         name: '[name].[ext]',
                         outputPath: 'fonts/'
                    }
               }],
          }],


     }, target: "web"
}