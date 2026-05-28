import { Injectable } from '@angular/core';
import { ExampleType } from '../example-viewer/example-viewer.component';
import stackblitz from '@stackblitz/sdk';
import { getExampleFiles } from '../example-viewer/utils';

@Injectable()
export class StackblitzWriter {
  open(type: string, exampleData: ExampleType) {
    const { files, dependencies } = getExampleFiles(type, exampleData);
    stackblitz.openProject(
      {
        title: `Angular Formly (${exampleData.title || ''})`,
        description: (exampleData.description || '').replace(/<[^>]*>?/gm, ''),
        template: 'angular-cli',
        tags: ['angular', 'formly', 'example', 'web'],
        files,
        dependencies,
      },
      { openFile: `src/app/app.component.ts` },
    );
  }
}
