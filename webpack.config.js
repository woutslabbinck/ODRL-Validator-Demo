const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";
const publicPath = isProd
  ? "/ODRL-Validator-Demo/" // GitHub Pages repo path
  : process.env.PUBLIC_PATH || "/";

module.exports = {
  target: "web",
  entry: "./src/index.ts",

  resolve: {
    mainFields: ["browser", "module", "main"]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath,
    clean: true
  },

  devServer: {
    static: { directory: path.resolve(__dirname, "src") },
    port: 5173
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },

  resolve: {
    extensions: [".ts", ".js"],

    // 1) Prefer browser entrypoints when present (default on "web" is already this)
    mainFields: ["browser", "module", "main"],

    // 2) Read the "browser" field as an alias/replacement map (object form)
    // StackOverflow error thread notes aliasFields: ["browser"] is on by default,
    // but we set it explicitly to avoid surprises.
    aliasFields: ["browser"],

    // 3) If any dependency accidentally pulls Node core modules, decide what to do:
    // Webpack 5 removed automatic polyfills; you must set fallbacks yourself. [3](https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5)[4](https://gist.github.com/ef4/d2cf5672a93cf241fd47c020b9b3066a)
    fallback: {
      fs: false,
      path: false,
      crypto: false,
      stream: false
    }
  },
  //TODO: remove when eyeling is fixed
  ignoreWarnings: [
    (warning) =>
      /Critical dependency: the request of a dependency is an expression/.test(
        warning.message || ""
      ) &&
      /eyeling\.browser\.js/.test(
        (warning.module && warning.module.resource) || ""
      ),
  ],
  plugins: [
    // TODO: remove after eyeling is fixed
    new webpack.NormalModuleReplacementPlugin(
      /eyeling/, // Regex matching the module you want to replace
      resource => {
        resource.request = path.resolve(__dirname, 'eyeling-patch.js');
      }
    ),
    new CopyPlugin({
      patterns: [
        { from: "src/index.html", to: "index.html" } // copy HTML into dist
      ],
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
    })
  ]
};
