import { readFileSync } from 'fs';
import { resolve } from 'path';
import { compile } from 'sass';

describe('Demo styles', () => {
  const root = resolve(__dirname, '../../..');
  const workspace = JSON.parse(readFileSync(resolve(root, 'angular.json'), 'utf8'));
  const options = workspace.projects.app.architect.build.options.stylePreprocessorOptions;
  const loadPaths = options.includePaths.map((path: string) => resolve(root, path));

  it('compiles without warnings using the build configuration', () => {
    const warnings: string[] = [];

    compile(resolve(root, 'demo/src/styles.scss'), {
      ...options.sass,
      loadPaths,
      quietDeps: true,
      verbose: true,
      logger: { warn: (message) => warnings.push(message) },
    });

    expect(warnings).toEqual([]);
  });

  it('compiles with only the Bootstrap import deprecation warnings', () => {
    const warnings: string[] = [];

    compile(resolve(root, 'demo/src/styles.scss'), {
      loadPaths,
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
