module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
		"$": true,
		"jQuery": true,
		"isSmartphone": true,
		
		"_css": true,
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
		"indent": [
			"error",
			"tab",
			{ "SwitchCase": 1 }
		],
    }
};