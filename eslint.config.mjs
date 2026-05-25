import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

export default [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'next-env.d.ts',
      'tsconfig.tsbuildinfo',
      'public/**',
    ],
  },
  {
    rules: {
      // The legacy editorial copy uses straight ' and " characters throughout.
      // Escaping them adds noise to every JSX block without changing the
      // rendered output, so this stylistic rule is intentionally disabled.
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    files: ['*.config.{js,mjs,ts}', 'tailwind.config.{js,ts}', 'postcss.config.{js,ts}'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
]
