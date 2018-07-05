const CleanWebpackPlugin = require("clean-webpack-plugin");

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
	entry: "./src/dp-form-app.js",
	mode: "production",
	output: {
		libraryTarget: "umd",
		filename: "dp-form-app.umd.js"
	},
	plugins: [new CleanWebpackPlugin(["dist"])]
};
