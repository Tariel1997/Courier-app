import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    ignores: ['dist', 'node_modules', 'build'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  pluginReact.configs.flat.recommended,

  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: '19.3',
      },
    },
  },

  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
  },
])
