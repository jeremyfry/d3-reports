const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
module.exports = {
	entry: './src/index.js',
	devtool: 'source-map',
	resolve: {
		modules: ['node_modules'],
		extensions: ['.js']
	},
	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env', 'stage-2']
					}
				}
			},
			{
				test: /\.csv$/,
				use: {
					loader: 'file'
				}
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
			}
		]
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: './src/index.ejs'
		})
	]
};