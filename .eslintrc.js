module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: [
    "react",
    "react-hooks",
    "@typescript-eslint/eslint-plugin",
    "prettier",
  ],
  rules: {
    camelcase: ["error", {
      "properties": "never",
      "ignoreDestructuring": true
    }],
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "@typescript-eslint/return-await": "off",
    "@typescript-eslint/camelcase": "off",
    "react/jsx-curly-brace-presence": ["error", "never"],
    "react/no-danger": "off",
    "no-param-reassign": ["error", { props: false }],
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "react/require-default-props": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-wrap-multilines": [
      "off",
      {
        declaration: "parens-new-line",
        assignment: "parens-new-line",
        return: "parens-new-line",
        arrow: "parens-new-line",
        condition: "parens-new-line",
        logical: "ignore",
        prop: "ignore",
      },
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        caughtErrors: "all",
        destructuredArrayIgnorePattern: "^_",
        ignoreRestSiblings: false,
      },
    ],
  },
  overrides: [
    {
      // Apply these settings to test files only
      files: ['**/*.test.ts', '**/*.spec.ts'], // Adjust the pattern to match your test files
      rules: {
        '@typescript-eslint/no-explicit-any': 'off', // Disable for test files
      },
    },
  ],
  reportUnusedDisableDirectives: true,
};
