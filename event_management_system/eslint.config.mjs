import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const cleanGlobals = (source) =>
  Object.fromEntries(
    Object.entries(source).map(([key, value]) => [key.trim(), value])
  );

export default [
  {
    ignores: ['.next/**', 'coverage/**', 'node_modules/**', 'out/**'],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@next/next/recommended',
    'prettier'
  ),
  {
    // Without an explicit files glob, flat config only matches **/*.js, so the
    // entire React app (every .jsx file) was silently never linted.
    files: ['**/*.js', '**/*.jsx'],

    plugins: {
      react,
      prettier,
    },

    languageOptions: {
      globals: {
        ...cleanGlobals(globals.browser),
        ...cleanGlobals(globals.node),
        ...cleanGlobals(globals.jest),
      },

      parser: babelParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        requireConfigFile: false,

        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'es5',
          singleQuote: true,
          semi: true,
        },
      ],
    },
  },
];
