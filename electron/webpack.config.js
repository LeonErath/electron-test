module.exports = {
	target: 'electron-main',
	devtool: 'source-map',
	entry: './electron/src/main',
	resolve: { extensions: ['.ts', '.js'] },
	output: {
		path: process.cwd(),
		filename: 'electron/bundle.js',
	},
	module: {
		rules: [{ test: /\.ts$/, use: 'ts-loader' }],
	},
};
