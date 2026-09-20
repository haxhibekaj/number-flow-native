const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const reactHooks = require('eslint-plugin-react-hooks');
const react = require('eslint-plugin-react');
const prettier = require('eslint-config-prettier');

const NODE_GLOBALS = {
  module: 'writable',
  require: 'readonly',
  __dirname: 'readonly',
  process: 'readonly',
  console: 'readonly',
};

module.exports = tseslint.config(
  { ignores: ['lib/**', 'coverage/**', 'node_modules/**', 'example/**', 'docs/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Build and tooling config files are CommonJS running in Node.
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs', globals: NODE_GLOBALS },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },

  {
    files: ['**/*.{ts,tsx}'],
    plugins: { react, 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // This caught a real conditional-hook bug here once. Keep it fatal.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Reanimated shared values are mutated through `.value` by design, which
      // this rule cannot model. Every hit in this package is that pattern.
      'react-hooks/immutability': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'error',
    },
  },

  {
    files: ['**/__tests__/**', 'jest.setup.ts'],
    languageOptions: { globals: { ...NODE_GLOBALS, jest: 'readonly' } },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },

  prettier
);
