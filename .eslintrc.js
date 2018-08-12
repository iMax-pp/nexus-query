module.exports = {
    "extends": "airbnb-base",
    "env": {
        "node": true
    },
    "parser": "typescript-eslint-parser",
    "parserOptions": {
        "sourceType": "module",
        "ecmaFeatures": {
            "modules": true
        }
    },
    "rules": {
        "no-unused-vars": ["error", { "argsIgnorePattern": "next" }]
    },
};