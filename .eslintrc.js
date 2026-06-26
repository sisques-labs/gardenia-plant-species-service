module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'boundaries'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist/**'],
  settings: {
    // Resolve the @contexts/* TS path aliases so boundaries can classify the
    // import targets as bounded-context elements.
    'import/resolver': {
      typescript: { project: 'tsconfig.json' },
    },
    // Bounded-context boundary enforcement. Element order matters: the first
    // matching pattern wins, so adapters are matched before the generic
    // `context` element.
    'boundaries/include': ['src/contexts/**/*.ts'],
    'boundaries/elements': [
      // 1. Adapters — the anti-corruption seam. The ONLY place allowed to
      //    import another bounded context's domain/application.
      {
        type: 'context-adapter',
        mode: 'full',
        pattern: 'src/contexts/*/infrastructure/adapters/**',
        capture: ['context', 'path'],
      },
      // 2. Everything else inside a bounded context.
      {
        type: 'context',
        mode: 'full',
        pattern: 'src/contexts/*/**',
        capture: ['context', 'path'],
      },
    ],
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    // A bounded context may only import its OWN context. Reaching another
    // context's domain/application is allowed exclusively from
    // infrastructure/adapters/ (the port implementation).
    'boundaries/element-types': [
      'error',
      {
        default: 'allow',
        rules: [
          {
            from: ['context'],
            disallow: [
              ['context', { context: '!${from.context}' }],
              ['context-adapter', { context: '!${from.context}' }],
            ],
            message:
              "Cross-context import is not allowed: '${from.context}' must reach '${target.context}' through a port (application/ports) + adapter (infrastructure/adapters).",
          },
        ],
      },
    ],
  },
};
