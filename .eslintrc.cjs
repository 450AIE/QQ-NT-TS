/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    extends: [
        'eslint:recommended',
        // 'plugin:vue/vue3-recommended',
        '@electron-toolkit',
        '@electron-toolkit/eslint-config-ts/eslint-recommended',
        '@vue/eslint-config-typescript/recommended',
        '@vue/eslint-config-prettier'
    ],
    rules: {
        'max-len': [2, 120],
        semi: [0],
        'vue/require-default-prop': 0,
        'vue/multi-word-component-names': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-unused-vars': 1, // 警告（未使用的变量）
        '@typescript-eslint/no-empty-function': 0,
        'prefer-const': 0
    }
}
