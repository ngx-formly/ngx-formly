import { readFileSync } from 'fs';
import { resolve } from 'path';
import { compile } from 'sass';

describe('Demo styles', () => {
  it('compiles with only the Bootstrap import deprecation warnings', () => {
    const root = resolve(__dirname, '../../..');
    const workspace = JSON.parse(readFileSync(resolve(root, 'angular.json'), 'utf8'));
    const options = workspace.projects.app.architect.build.options.stylePreprocessorOptions;
    const warnings: string[] = [];

    compile(resolve(root, 'demo/src/styles.scss'), {
      loadPaths: options.includePaths.map((path: string) => resolve(root, path)),
      quietDeps: true,
      verbose: true,
      logger: {
        warn: (message, warning) => {
          if (
            warning.deprecation &&
            warning.deprecationType.id === 'import' &&
            warning.span?.text.startsWith("'bootstrap/scss/")
          ) {
            return;
          }

          warnings.push(message);
        },
      },
    });

    expect(warnings).toEqual([]);
  });
});
