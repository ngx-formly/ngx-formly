import { describe, expect, it } from 'vitest';
import { getExampleFiles } from './utils';

const example = { title: '', description: '', component: null, debug: false, files: [] };

describe('getExampleFiles', () => {
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
});
