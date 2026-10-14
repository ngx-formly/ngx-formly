import { Tree } from '@angular-devkit/schematics';
import { WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { getIndexHtmlPath, getStylesPath } from './ast';

describe('workspace paths', () => {
  it.each([{}, { architect: {} }, { architect: { build: {} } }])(
    'reports missing build paths for %j',
    (project) => {
      expect(() => getIndexHtmlPath(Tree.empty(), project as WorkspaceProject)).toThrow('No index.html file was found.');
      expect(() => getStylesPath(Tree.empty(), project as WorkspaceProject)).toThrow(
        'No style files could be found into which a theme could be added',
      );
    },
  );
});
