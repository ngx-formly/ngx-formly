module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'subject-max-length': [1, 'always', 72],
    'scope-enum': [
      2,
      'always',
      [
        'demo',
        'guides',
        'core',
        'testing',
        'select',
        'preset',
        'schematics',
        'json-schema',
        'material',
        'bootstrap',
        'ionic',
        'primeng',
        'kendo',
        'ng-zorro-antd',
        'nativescript',
      ],
    ],
    'scope-empty': [1, 'never'],
    'scope-case': [2, 'always', 'lowerCase'],
    'type-enum': [
      2,
      'always',
      ['build', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'release', 'revert', 'style', 'test', 'chore'],
    ],
  },
};
