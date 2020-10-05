module.exports = {
  mode: "development",
  entry: [
    "./src/3dmodel.ts",
    "./src/index.html",
    "./src/manifest.ini",
    "./src/mvp.css",
  ],
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.(html|css|ini)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
  },
  performance: {
    hints: false,
  },
};
