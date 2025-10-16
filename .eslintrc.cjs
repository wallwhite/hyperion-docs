/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: [
    require.resolve('@spellix/eslint-config/client'),
    require.resolve('@spellix/eslint-config/prettier'),
    require.resolve('@spellix/eslint-config/typescript'),
  ],
  ignorePatterns: ['node_modules/', 'dist/'],
  overrides: [
    {
      files: ['*.cjs', '.*.js', '*.config.js', '*.config.ts', '*.fixture.ts', 'seed.ts'],
      rules: {
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'import/no-relative-packages': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-unassigned-import': 'off',
        'no-undefined': 'off',
        'no-magic-numbers': 'off',
        'no-alert': 'off',
        'no-console': 'off',
      },
    },
    {
      files: ['*.d.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: ['**/nest-*/**/*.ts'],
      rules: {
        '@typescript-eslint/no-extraneous-class': 'off',
      },
    },
    {
      files: ['**/nest-*/**/*.dto.ts'],
      rules: {
        'max-classes-per-file': 'off',
      },
    },
    {
      files: ['**/theme/src/preset/**/*.ts', '**/theme/src/preset/**/*.tsx'],
      rules: {
        'no-undefined': 'off',
        'no-magic-numbers': 'off',
        'unicorn/no-useless-undefined': 'off',
        'sonarjs/no-nested-template-literal': 'off',
      },
    },
    {
      files: ['cli/**/*.ts'],
      rules: {
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/no-confusing-void-expression': 'off',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        'sonarjs/no-os-command-from-path': 'off',
        'sonarjs/no-duplicated-branches': 'off',
        'sonarjs/cognitive-complexity': 'off',
        'sonarjs/os-command': 'off',
        'sonarjs/function-return-type': 'off',
        'sonarjs/no-hardcoded-ip': 'off',
        'unicorn/no-process-exit': 'off',
        'consistent-return': 'off',
        'no-promise-executor-return': 'off',
        'no-await-in-loop': 'off',
        'no-console': 'off',
        'no-void': 'off',
      },
    },
    {
      files: ['*.js', '*.cjs', '*.jsx', '*.tsx', '*.ts'],
      rules: {
        'eslint-comments/require-description': 'off',
        'import/order': [
          2,
          {
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
            pathGroups: [
              {
                pattern: 'react',
                group: 'builtin',
                position: 'before',
              },
              {
                pattern: 'react*',
                group: 'builtin',
              },
              {
                pattern: '@react*',
                group: 'builtin',
                position: 'after',
              },
              {
                pattern: '@spellix/**',
                group: 'external',
                position: 'after',
              },
              {
                pattern: '*.sass',
                group: 'index',
                position: 'after',
              },
            ],
            pathGroupsExcludedImportTypes: ['react', '@spellix'],
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
          },
        ],
      },
    },
  ],
};
