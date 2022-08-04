import { Injectable } from '@angular/core';
import { ExampleType } from '../example-viewer/example-viewer.component';
import stackblitz from '@stackblitz/sdk';
import { COPYRIGHT, dependencies, ngModule, TEMPLATE_FILES } from './stackblitz.config';
import { angularVersion } from 'src/schematics/utils/lib-versions';

interface IStackblitzThemeOption {
  type: string;
  useAnimation?: boolean;
  includeMaterial?: boolean;
  includeAgGrid?: boolean;
  includeFontawesome?: boolean;
  includeNgxTranslate?: boolean;
}

@Injectable()
export class StackblitzWriter {
  open(type: string, exampleData: ExampleType) {
    const { files, dependencies } = this.getExampleFiles(type, exampleData);
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

  private getExampleFiles(type: string, exampleData: ExampleType): any {
    const appModuleContent = exampleData.files.find((f) => f.file === 'app.module.ts').filecontent.default;
    exampleData.deps = exampleData.deps || [];

    const options: IStackblitzThemeOption = { type };

    if (['bootstrap', 'material', 'kendo', 'ionic', 'primeng', 'ng-zorro-antd'].indexOf(options.type) === -1) {
      if (appModuleContent.indexOf('@ngx-formly/bootstrap') !== -1) {
        options.type = 'bootstrap';
      } else if (appModuleContent.indexOf('@ngx-formly/material') !== -1) {
        options.type = 'material';
      } else if (appModuleContent.indexOf('@ngx-formly/kendo') !== -1) {
        options.type = 'kendo';
      } else if (appModuleContent.indexOf('@ngx-formly/ionic') !== -1) {
        options.type = 'ionic';
      } else if (appModuleContent.indexOf('@ngx-formly/primeng') !== -1) {
        options.type = 'primeng';
      } else if (appModuleContent.indexOf('@ngx-formly/ng-zorro-antd') !== -1) {
        options.type = 'ng-zorro-antd';
      }
    }

    if ('material' === options.type || appModuleContent.indexOf('@angular/material') !== -1) {
      options.includeMaterial = true;
    }

    if (
      ['material', 'kendo', 'material'].indexOf(options.type) !== -1 ||
      options.includeMaterial ||
      exampleData.files.some((f) => this._getFilecontent(f.filecontent).indexOf('@angular/animations') !== -1)
    ) {
      options.useAnimation = true;
    }

    if (appModuleContent.indexOf('ag-grid-angular') !== -1) {
      options.includeAgGrid = true;
    }

    if (exampleData.deps.indexOf('fontawesome') !== -1) {
      options.includeFontawesome = true;
    }

    if (appModuleContent.indexOf('@ngx-translate/core') !== -1) {
      options.includeNgxTranslate = true;
    }

    const deps = {
      ...dependencies.core,
      ...dependencies[options.type],
    };

    if (options.useAnimation) {
      deps['@angular/animations'] = angularVersion;
    }

    if (options.includeMaterial) {
      deps['@angular/cdk'] = angularVersion;
      deps['@angular/material'] = angularVersion;
    }

    if (options.includeAgGrid) {
      Object.assign(deps, dependencies['ag-grid']);
    }

    if (options.includeNgxTranslate) {
      Object.assign(deps, dependencies['ngx-translate']);
    }

    const files: { [id: string]: string } = {
      'src/environments/environment.ts': require('!!raw-loader!@assets/stackblitz/environment.ts').default,
      'src/environments/environment.prod.ts': require('!!raw-loader!@assets/stackblitz/environment.prod.ts').default,
      'package.json': JSON.stringify(
        {
          name: 'formly-example-app',
          version: '0.0.0',
          scripts: {
            ng: 'ng',
            start: 'ng serve',
            build: 'ng build',
            watch: 'ng build --watch --configuration development',
            test: 'ng test',
          },
          dependencies: deps,
          devDependencies: {
            '@angular-devkit/build-angular': '~14.0.0',
            '@angular/cli': '~14.0.0',
            '@angular/compiler-cli': '~14.0.0',
            '@types/node': '^12.11.1',
            typescript: '~4.7.4',
          },
        },
        null,
        2,
      ),
    };

    [...TEMPLATE_FILES.core, ...TEMPLATE_FILES[options.type], ...exampleData.files].forEach((data) => {
      let file = data.file;

      if (file.match(/(component|module|type)/)) {
        file = 'app/' + file;
      }

      if (!file.match(/(angular|package|tsconfig|stackblitzrc|favicon)/)) {
        file = 'src/' + file;
      }

      files[file] = this._replaceExamplePlaceholderNames(data.file, data.filecontent, options);
    });

    return { files, dependencies: deps };
  }

  _replaceExamplePlaceholderNames(filename: string, filecontent: any, options: IStackblitzThemeOption): string {
    filecontent = this._getFilecontent(filecontent);
    if (filename === 'app.module.ts') {
      if (options.type === 'ionic') {
        filecontent = filecontent.replace(
          `'@angular/common';`,
          `'@angular/common';\nimport { IonicModule } from '@ionic/angular';`,
        );
        filecontent = filecontent.replace(`FormlyModule.forRoot`, `IonicModule.forRoot(),\n    FormlyModule.forRoot`);
      }

      if (filecontent.indexOf(`@ngx-formly/${options.type}'`) === -1) {
        filecontent = filecontent.replace(
          `'@ngx-formly/core';`,
          `'@ngx-formly/core';\nimport { ${ngModule[options.type]} } from '@ngx-formly/${options.type}';`,
        );
        filecontent = filecontent.replace(
          `FormlyModule.forRoot`,
          `${ngModule[options.type]},\n    FormlyModule.forRoot`,
        );
      }

      if (options.useAnimation) {
        filecontent = filecontent.replace('@angular/common', '@angular/platform-browser/animations');
        filecontent = filecontent.replace(/CommonModule/g, 'BrowserAnimationsModule');
      } else {
        filecontent = filecontent.replace('@angular/common', '@angular/platform-browser');
        filecontent = filecontent.replace(/CommonModule/g, 'BrowserModule');
      }

      if (filecontent.indexOf(`bootstrap: [AppComponent]`) === -1) {
        filecontent = filecontent.replace('declarations: [', `bootstrap: [AppComponent],\n  declarations: [`);
      }
    } else if (filename === 'styles.scss') {
      filecontent = `${filecontent}\nbody { padding: 10px; }`;

      if (options.type !== 'material' && options.includeMaterial) {
        filecontent = `${filecontent}\n@import '@angular/material/prebuilt-themes/deeppurple-amber.css'; `;
      }

      if (options.includeAgGrid) {
        filecontent = `${filecontent}\n@import 'ag-grid-community/dist/styles/ag-grid.css'; `;
        filecontent = `${filecontent}\n@import 'ag-grid-community/dist/styles/ag-theme-balham.css'; `;
      }
    }

    if (filename === 'index.html' && options.includeFontawesome) {
      filecontent = `<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">\n${filecontent}`;
    }

    filecontent = filecontent.replace(/_json/g, '.json');

    return this._appendCopyright(filename, filecontent);
  }

  _appendCopyright(filename: string, content: string) {
    if (filename.indexOf('.ts') > -1 || filename.indexOf('.scss') > -1) {
      content = `${content}\n\n/**  ${COPYRIGHT} */`;
    } else if (filename.indexOf('.html') > -1) {
      content = `${content}\n\n<!-- ${COPYRIGHT} -->`;
    }
    return content;
  }

  _getFilecontent(content: any) {
    if (typeof content === 'string') {
      return content;
    }

    return content.default;
  }
}
