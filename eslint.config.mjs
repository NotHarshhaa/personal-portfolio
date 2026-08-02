import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  {
    ignores: [
      'dist/**',
      '.next/**',
      'next-env.d.ts',
      'node_modules/**'
    ]
  },
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime'
  ),
  {
    rules: {
      '@typescript-eslint/indent': 'off',
      '@next/next/no-head-element': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'react-refresh/only-export-components': 'off',
      'react/prop-types': 'off',
      'react/jsx-no-target-blank': ['error', { allowReferrer: false }]
    }
  }
]

export default eslintConfig
