export default {
  plugins: ['@stylistic/stylelint-plugin'],
  extends: [ 'stylelint-config-standard-scss', '@stylistic/stylelint-config'],
  rules: {
    'selector-class-pattern': null,
    'scss/at-mixin-pattern': null,
    'scss/dollar-variable-pattern': null,
    'no-descending-specificity': null,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    '@stylistic/string-quotes': null,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
    'nesting-selector-no-missing-scoping-root': null,
  },
};
