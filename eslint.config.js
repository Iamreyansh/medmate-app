const expoConfig = require('eslint-config-expo/flat');

/**
 * Flat ESLint config for the MedMate monorepo.
 *
 * `eslint-config-expo` covers the React Native + Expo rules (hooks, RN
 * imports, TypeScript). The app and the shared theme package share one
 * config so the design tokens are held to the same standard as the screens.
 */
module.exports = [
  ...expoConfig,
  {
    ignores: [
      '**/node_modules/**',
      '**/.expo/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
    ],
  },
];
