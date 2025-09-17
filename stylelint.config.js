export default {
  plugins: ['@stylistic/stylelint-plugin', 'stylelint-prettier'],
  extends: ['stylelint-config-standard-scss', '@stylistic/stylelint-config'],
  rules: {
    'prettier/prettier': true,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
    'at-rule-disallowed-list': [['import'], { severity: 'error' }],

    'scss/operator-no-newline-after': null,
    'nesting-selector-no-missing-scoping-root': null,
    '@stylistic/string-quotes': null,
    'selector-class-pattern': null,
    'scss/at-mixin-pattern': null,
    'scss/dollar-variable-pattern': null,
    'no-descending-specificity': null,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
  },
  ignoreFiles: ['**/node_modules/**', '**/build/**'],
};
