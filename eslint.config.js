import js from '@eslint/js';

export default [
  js.configs.recommended, // Recommended config applied to all files
  // Override the recommended config
  {
    rules: {
      indent: ['error', 2],
      'no-unused-vars': 'warn',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'eqeqeq': 'error',
      'curly': 'error',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-undef': 'off',
      'prefer-template': 'error',
    }
  }
];