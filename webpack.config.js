const path = require('path');

module.exports = {
	mode: 'development',
	entry: './index.js',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 9000,
	},
	watchOptions: {
		ignored: '/node_modules/',
	},
};
