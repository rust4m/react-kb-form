const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const packageJSON = require("./package.json");

const outPath = "./build";
const dstPath = path.join(__dirname, outPath);
const srcPath = path.join(__dirname, "./src");

module.exports = {
  mode: "none",
  entry: {
    app: path.join(__dirname, "src", "index.ts"),
  },
  target: "web",
  resolve: {
    modules: [srcPath, "node_modules"],
    extensions: [".ts", ".tsx", ".js"],
    mainFields: ["main", "browser", "module"],
    alias: {
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
    },
    symlinks: false,
  },
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
          {
            loader: "ts-loader",
            options: {
              configFile: path.join(__dirname, "tsconfig.lib.json"),
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js($|\?)/i,
        cache: true,
        parallel: true,
        extractComments: "all",
        uglifyOptions: {
          compress: {
            sequences: true,
            booleans: true,
            loops: true,
            unused: true,
            drop_console: true,
            unsafe: true,
          },
          output: null,
        },
        sourceMap: true,
        exclude: [/node_modules\//],
      }),
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
    libraryTarget: "umd",
    library: packageJSON.name,
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, "./package.json"),
        to: `${dstPath}/package.json`,
      },
      {
        from: path.join(__dirname, "./src/ambient/index.d.ts"),
        to: `${dstPath}/ambient/index.d.ts`,
      },
      // {
      //   from: path.join(__dirname, "../README.md"),
      //   to: `${dstPath}/README.md`,
      // },
      // {
      //   from: path.join(__dirname, "../CHANGELOG.md"),
      //   to: `${dstPath}/CHANGELOG.md`,
      // },
    ]),
  ],
};
