/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    project: `${__dirname}/tsconfig.json`,
  },
  extends: [
    require.resolve('@spellix/eslint-config/client'),
    require.resolve('@spellix/eslint-config/prettier'),
    require.resolve('@spellix/eslint-config/typescript'),
    require.resolve('@spellix/eslint-config/react'),
  ],
  ignorePatterns: ['node_modules/', 'dist/'],
  overrides: [
    {
      files: ['./src/app/**/*.tsx'],
      rules: {
        'react/jsx-pascal-case': 'off',
      },
    },
    {
      files: ['*.d.ts'],
      rules: {
        'import/no-unassigned-import': 'off',
      },
    },
    {
      files: ['*.config.*'],
      rules: {
        'import/no-unresolved': 'off',
      },
    },
    {
      files: ['*.d.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: ['*.store.ts', '*.store.tsx'],
      rules: {
        'no-param-reassign': 'off',
        'sonarjs/cognitive-complexity': 'off',
      },
    },
    {
      files: ['*.js', '*.cjs', '*.jsx', '*.tsx', '*.ts'],
      rules: {
        'no-console': 'warn',
        'no-magic-numbers': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        'eslint-comments/require-description': 'off',
        'unicorn/consistent-function-scoping': 'off',
        'import/order': [
          'error',
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
                pattern: '@repo/**',
                group: 'internal',
                position: 'before',
              },
              {
                pattern: '@/assets/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@/lib/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@/modules/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@/shared/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: './*.scss',
                group: 'object',
                position: 'after',
              },
            ],
            pathGroupsExcludedImportTypes: ['react', '@spellix'],
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
            distinctGroup: true,
          },
        ],
      },
    },
  ],
};
