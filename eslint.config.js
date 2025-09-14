import { builtinModules } from 'node:module';

import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const nodeBuiltins = builtinModules.join('|');

export default [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '*.config.js',
      'netlify.toml',
      '.prettierignore',
      '.prettierrc',
      '**/*.module.scss.d.ts',
    ],
  },
  {
    files: ['**/*.{js,ts,mjs,mts}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { project: './tsconfig.json' },
    },

    settings: {
      'import/resolver': { typescript: { project: './tsconfig.json' }, node: { extensions: ['.ts', '.mts'] } },
      'import/parsers': { '@typescript-eslint/parser': ['.js', '.ts', '.mts', '.mjs'] },
      'import/internal-regex': '^(@common|@components|@utils|@src|@pages|@api|@store|@controllers)(/|$)',
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      'prettier/prettier': 'off',
      'import/extensions': 'off',
      'import/no-duplicates': ['error', { 'prefer-inline': false, considerQueryString: true }],
      'lines-between-class-members': ['warn', 'always', { exceptAfterSingleLine: false }],
      'eol-last': ['error', 'always'],
      'no-loss-of-precision': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            [`^(${nodeBuiltins})(/|$)`, '^node:', `^(${nodeBuiltins})(/|$)\\u0000$`, '^node:.+\\u0000$'],
            [
              '^vite',
              '^Handlebars+',
              '^@?(?!(common|components|utils|src|pages|api|store|controllers)\\b)\\w',
              '^@?(?!(common|components|utils|src|pages|api|store|controllers)\\b)\\w(.+)?\\u0000$',
            ],
            [
              '^(@common|@components|@utils|@src|@pages|@api|@store|@controllers)(/|$|/.+)?',
              '^(@common|@components|@utils|@src|@pages|@api|@store|@controllers)(/|$|/.+)?\\u0000$',
            ],
            ['^\\.\\./', '^\\./', '^\\.\\./(.+)?\\u0000$', '^\\./(.+)?\\u0000$'],
            ['^.+\\.scss$'],
          ],
        },
      ],
      'import/no-cycle': 'error',
      'arrow-body-style': 'warn',
      'max-len': [
        'error',
        {
          code: 120,
          tabWidth: 2,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'class-methods-use-this': 'off',
      'global-require': 'off',
      'no-use-before-define': 'off',
      'no-shadow': 'off',
      'no-unused-vars': 'off',

      '@typescript-eslint/no-empty-object-type': 'error',
      'no-object-constructor': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true, ignoreRestArgs: true }],
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
      '@typescript-eslint/naming-convention': [
        'warn',
        { selector: 'variable', format: null, leadingUnderscore: 'allow' },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'enumMember', format: ['camelCase', 'PascalCase'] },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: false, fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-loss-of-precision': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { args: 'all', argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],

      'import/prefer-default-export': 'off',
      'import/named': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
];
