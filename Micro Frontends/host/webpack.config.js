const HtmlWebpackPlugin = require("html-webpack-plugin");
const {ModuleFederationPlugin} = require("webpack").container;

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    publicPath: "http://localhost:3000",
  },
  devServer: {
    port:3000,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        remoteApp: "remote@http://localhost:3001/remoteEntry.js",
      },
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};























