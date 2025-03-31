module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert']
        ],
        'subject-full-stop': [2, 'never', '.'],
        'subject-case': [2, 'always', ['lower-case']]
    }
}
