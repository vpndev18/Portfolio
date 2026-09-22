import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // The Vite entry point mounts the app and exports nothing by design, so
    // react-refresh's "components must be exported" rule cannot apply. The
    // lazy() route handles here are never hot-reloaded as modules themselves.
    files: ['src/main.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
