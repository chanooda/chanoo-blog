module.exports = {
  env: {
    node: true
  },
  extends: [
    'turbo',
    'eslint:recommended',
    'plugin:@next/next/recommended',
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:typescript-sort-keys/recommended',
    'plugin:prettier/recommended'
  ],

  ignorePatterns: ['.eslintrc.js', '**/*.config.*', './node_modules/*', 'index.js'],

  parser: '@typescript-eslint/parser',

  parserOptions: {
    babelOptions: { presets: [require.resolve('next/babel')] },
    project: ['tsconfig.json'],
    createDefaultProgram: true
  },

  plugins: ['sort-keys-fix', '@typescript-eslint'],

  rules: {
    '@next/next/no-html-link-for-pages': 'off',

    // 함수 인자 하나일 때 () 감쌀지 말지
    'arrow-parens': [2, 'always'],

    // import 할때 확장자 안붙히게
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],

    // devDependencies module import 가능하게
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true
      }
    ],

    // 내보내는게 하나일 때 export default 사용하기
    'import/prefer-default-export': 'off',

    // 다시 내보내기 할 때 default export 하는 방식
    'no-restricted-exports': ['error'],

    // jsx 문법을 사용할 수 있는 파일 확장명
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],

    // jsx key 체크
    'react/jsx-key': [
      2,
      { checkFragmentShorthand: true, checkKeyMustBeforeSpread: true, warnOnDuplicates: true }
    ],

    // props spread 문법 사용
    'react/jsx-props-no-spreading': [0],

    // react props 정렬 설정
    'react/jsx-sort-props': [
      2,
      {
        callbacksLast: true,
        multiline: 'last',
        shorthandFirst: false
      }
    ],
    'react/prop-types': [0],
    // jsx 문법 사용시에 react import
    'react/react-in-jsx-scope': 'off',

    'react/require-default-props': [0],
    // 객체 key 알파벳 순 정렬
    // 'sort-keys': ['error', 'asc', { caseSensitive: true }]
    // 'sort-keys-fix/sort-keys-fix': 'warn'

    'no-restricted-syntax': [0]
  }
};
