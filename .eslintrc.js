module.exports = {
	env: {
		browser: true,
	},
	extends: ['airbnb-base', 'prettier'],
	parser: '@babel/eslint-parser',
	parserOptions: {
		sourceType: 'module',
		babelOptions: {
			configFile: './.babelrc',
		},
	},
	plugins: ['@babel', 'import', 'prettier'],
	rules: {
		'prettier/prettier': 'error',
		'max-len': ['error', { code: 120, tabWidth: 2 }],
		'import/extensions': ['error', 'always'],
		'no-underscore-dangle': [
			'error',
			{
				allow: ['__ticker__'],
			},
		],
	},
};
