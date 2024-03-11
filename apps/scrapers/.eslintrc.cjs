/** @type { import("eslint").Linter.Config } */
const config = {
  root: true,
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    node: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020
  }
};

module.exports = config;
