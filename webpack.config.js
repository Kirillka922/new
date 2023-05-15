let path = require("path");
let MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env", "@babel/preset-react"] },
      },
      {
        test: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[local]__[sha1:hash:hex:7]",
              },
            },
          },
        ],
      },
      {
        test: /^((?!\.module).)*css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "main.css",
    }),
  ],
};
module.exports = (env, options) => {
  let isProd = options.mode === "production";
  conf.devtool = isProd ? false : "eval-cheap-module-source-map";
  return conf;
};
