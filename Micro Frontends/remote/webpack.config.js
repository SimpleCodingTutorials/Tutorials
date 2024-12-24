const HtmlWebpackPlugin = require("html-webpack-plugin");
const {ModuleFederationPlugin} = require("webpack").container;
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    publicPath: "http://localhost:3001/",
  },
  devServer: {
    port:3001,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remote",
      filename: "remoteEntry.js",
      exposes: {
        "./HelloWorld": "./src/HelloWorld",
      },
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};





















