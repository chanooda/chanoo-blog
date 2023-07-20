/* eslint-env node */

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['custom'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: true
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-non-null-assertion': 'off'
  }
};
