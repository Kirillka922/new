let path = require("path");

let conf = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "main.js",
    publicPath: "/dist/",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "."),
    },
  },
};
module.exports = (env, options) => {
  let isProd = options.mode === "production";
  conf.devtool = isProd ? false : "eval-cheap-module-source-map";
  return conf;
};
