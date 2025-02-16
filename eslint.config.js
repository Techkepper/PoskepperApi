// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const tseslint = require('typescript-eslint')
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const eslint = require('@eslint/js')

// eslint-disable-next-line no-undef
module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    rules: {
      semi: ['error', 'never'],
      'no-unused-vars': 'off',
      quotes: ['error', 'single'],
      'no-console': 'warn',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-trailing-spaces': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-extra-semi': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      'no-multi-spaces': 'error',
      'no-implicit-globals': 'error',
    },
  }
)
