import { describe, expect, it } from 'vitest';
import { getExampleFiles } from './utils';
import datepickerConfig from '../../ui/ui-optimus-ui/datepicker/app.config.ts?raw' with { loader: 'text' };

const example = { title: '', description: '', component: null, debug: false, files: [] };

describe('getExampleFiles', () => {
  it('keeps TypeScript helper files beside the components that import them', () => {
    const { files } = getExampleFiles('bootstrap', {
      ...example,
      files: [
        { file: 'app.component.ts', filecontent: "import { accessor } from './file-value-accessor';" },
        { file: 'file-value-accessor.ts', filecontent: 'export const accessor = {};' },
      ],
    });
    expect(files['src/app/file-value-accessor.ts']).toContain('export const accessor');
    expect(files['src/file-value-accessor.ts']).toBeUndefined();
    expect(files['src/main.ts']).toContain('bootstrapApplication');
  });

  it.each(['primeng', 'core'])('exports installable PrimeNG 21 examples for %s', (type) => {
    const { files, dependencies } = getExampleFiles(type, {
      ...example,
      files: [
        {
          file: 'app.config.ts',
          filecontent: "import { withFormlyPrimeNG } from '@ngx-formly/primeng';",
        },
      ],
    });
    const manifest = JSON.parse(files['package.json']);

    expect(manifest.dependencies.primeng).toBe('^21.1.10');
    expect(manifest.dependencies).toEqual(dependencies);
    expect(manifest.overrides).toEqual({
      primeng: {
        '@angular/cdk': '$@angular/cdk',
        '@angular/common': '$@angular/common',
        '@angular/core': '$@angular/core',
        '@angular/forms': '$@angular/forms',
        '@angular/platform-browser': '$@angular/platform-browser',
        '@angular/router': '$@angular/router',
      },
    });
    for (const dependency of Object.keys(manifest.overrides.primeng)) {
      expect(manifest.dependencies[dependency]).toMatch(/^\^22\./);
    }
  });

  it('omits PrimeNG overrides for other UI libraries', () => {
    const { files } = getExampleFiles('bootstrap', example);
    const manifest = JSON.parse(files['package.json']);

    expect(manifest.dependencies.primeng).toBeUndefined();
    expect(manifest.overrides).toBeUndefined();
  });

  it.each(['optimus-ui', 'core'])('exports Optimus UI examples with the Aura theme for %s', (type) => {
    const files = type === 'optimus-ui' ? [] : [{ file: 'app.config.ts', filecontent: datepickerConfig }];
    const { files: exported } = getExampleFiles(type, { ...example, files });
    const manifest = JSON.parse(exported['package.json']);
    expect(manifest.dependencies['@ngx-formly/optimus-ui']).toBe(manifest.dependencies['@ngx-formly/core']);
    expect(manifest.dependencies['@openng/optimus-ui']).toBe('^2.1.0');
    expect(manifest.dependencies['@openng/optimus-ui-themes']).toBe('^2.1.0');
    expect(manifest.dependencies.primeng).toBeUndefined();
    expect(manifest.overrides).toBeUndefined();
    expect(exported['src/app/app.config.ts']).toContain('withFormlyOptimusUI()');
    const project = JSON.parse(exported['angular.json']).projects['formly-app'];
    expect(exported[project.architect.build.options.tsConfig]).toContain('"extends": "./tsconfig.json"');
    expect(exported['tsconfig.json']).toBeDefined();
    expect(exported['src/app/app.config.ts']).toContain('provideOptimus({ theme: { preset: Aura } })');
  });
});
