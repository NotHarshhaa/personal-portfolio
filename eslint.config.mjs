import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

// eslint-config-next v16 ships flat configs — import them directly.
// Routing them through @eslint/eslintrc's FlatCompat breaks with a
// circular-structure error, because the legacy eslintrc validator receives
// flat-config arrays it was never built to normalize.
const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'next-env.d.ts'
    ]
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@next/next/no-head-element': 'off',
      'react-refresh/only-export-components': 'off',
      'react/prop-types': 'off',
      // eslint-plugin-react-hooks v6 ships experimental compiler-era purity
      // rules that flag the standard mounted hydration guard and Date.now()
      // inside event handlers. Keep them visible as warnings, not build errors.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/set-state-in-render': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/purity': 'warn'
    }
  }
]

export default eslintConfig
