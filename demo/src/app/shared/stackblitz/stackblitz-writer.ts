import { Injectable } from '@angular/core';
import { ExampleType } from '../example-viewer/example-viewer.component';

const STACKBLITZ_URL = 'https://run.stackblitz.com/api/angular/v1';

const COPYRIGHT = `Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license`;

const TEMPLATE_FILES: { [id: string]: ExampleType['files'] } = {
  core: [
    { file: 'polyfills.ts', filecontent: require('!!raw-loader!@assets/stackblitz/polyfills.ts') },
    { file: 'angular.json', filecontent: require('!!raw-loader!@assets/stackblitz/angular_json') },
    { file: 'main.ts', filecontent: require('!!raw-loader!@assets/stackblitz/main.ts') },
    { file: 'index.html', filecontent: require('!!raw-loader!@assets/stackblitz/index.html') },
  ],
  bootstrap: [{ file: 'styles.scss', filecontent: { default: `@import '~bootstrap/scss/bootstrap.scss';` } }],
  material: [
    {
      file: 'styles.scss',
      filecontent: { default: `@import '~@angular/material/prebuilt-themes/deeppurple-amber.css';` },
    },
  ],
  kendo: [{ file: 'styles.scss', filecontent: { default: `@import '~@progress/kendo-theme-default/dist/all.css';` } }],
  primeng: [
    {
      file: 'styles.scss',
      filecontent: {
        default: `
        @import '~primeng/resources/primeng.min.css';
        @import '~primeng/resources/themes/bootstrap/theme.css';
      `,
      },
    },
  ],
  ionic: [
    {
      file: 'styles.scss',
      filecontent: {
        default: `
        @import "~@ionic/angular/css/core.css";
        @import "~@ionic/angular/css/normalize.css";
        @import "~@ionic/angular/css/structure.css";
        @import "~@ionic/angular/css/typography.css";

        @import "~@ionic/angular/css/padding.css";
        @import "~@ionic/angular/css/float-elements.css";
        @import "~@ionic/angular/css/text-alignment.css";
        @import "~@ionic/angular/css/flex-utils.css";
      `,
      },
    },
  ],
  'ng-zorro-antd': [
    {
      file: 'styles.scss',
      filecontent: {
        default: `
        @import '~ng-zorro-antd/ng-zorro-antd.min.css';
      `,
      },
    },
  ],
};

const TAGS: string[] = ['angular', 'formly', 'example'];
const angularVersion = '^7.0.0';
const materialVersion = '^7.0.0';
const formlyVersion = '^5.0.0';

const dependencies = {
  core: {
    '@angular/common': angularVersion,
    '@angular/compiler': angularVersion,
    '@angular/core': angularVersion,
    '@angular/forms': angularVersion,
    '@angular/platform-browser': angularVersion,
    '@angular/platform-browser-dynamic': angularVersion,
    'core-js': '^2.4.1',
    rxjs: '^6.4.0',
    'zone.js': '^0.9.0',
    tslib: '^1.7.0',

    '@ngx-formly/core': formlyVersion,
  },
  bootstrap: {
    '@ngx-formly/bootstrap': formlyVersion,
    bootstrap: '^4.2.1',
    'popper.js': '^1.14',
    jquery: '^3',
  },
  material: {
    '@ngx-formly/material': formlyVersion,
  },
  kendo: {
    '@ngx-formly/kendo': formlyVersion,
    '@progress/kendo-theme-default': '^3.2.0',
    '@progress/kendo-angular-dropdowns': '^4.0.0',
    '@progress/kendo-angular-popup': '^3.0.0',
    '@progress/kendo-angular-common': '^1.0.0',
    '@progress/kendo-angular-l10n': '^1.0.0',
    'rxjs-compat': '^6.4.0',
  },
  primeng: {
    '@ngx-formly/primeng': formlyVersion,
    primeng: '^7.0.5',
  },
  ionic: {
    '@ngx-formly/ionic': formlyVersion,
    '@ionic/angular': '4.0.0-beta.7', // workaround for https://github.com/ionic-team/ionic/issues/16354
    '@angular-devkit/core': '*',
    '@angular-devkit/schematics': '*',
    '@angular/compiler-cli': '*',
    '@angular/router': '*',
    typescript: '*',
  },
  // non UI framework libraries
  'ag-grid': {
    'ag-grid-angular': '*',
    'ag-grid-community': '*',
    '@angular/compiler-cli': angularVersion,
    typescript: '*',
  },
  'ngx-datatable': {
    '@swimlane/ngx-datatable': '*',
  },
  'ngx-translate': {
    '@ngx-translate/core': '*',
    '@ngx-translate/http-loader': '*',
  },
  'ng-zorro-antd': {
    '@ngx-formly/ng-zorro-antd': formlyVersion,
    'ng-zorro-antd': '^8.0.0',
  },
};

const ngModule = {
  bootstrap: 'FormlyBootstrapModule',
  material: 'FormlyMaterialModule',
  kendo: 'FormlyKendoModule',
  primeng: 'FormlyPrimeNGModule',
  ionic: 'FormlyIonicModule',
  'ng-zorro-antd': 'FormlyNgZorroAntdModule',
};

/**
 * Stackblitz writer, write example files to stackblitz
 *
 * StackBlitz API
 * URL: https://run.stackblitz.com/api/aio/v1/
 * data: {
 *   // File name, directory and content of files
 *   files[file-name1]: file-content1,
 *   files[directory-name/file-name2]: file-content2,
 *   // Can add multiple tags
 *   tags[0]: tag-0,
 *   // Description of stackblitz
 *   description: description,
 *   // Private or not
 *   private: true
 *  // Dependencies
 *  dependencies: dependencies
 * }
 */
@Injectable()
export class StackblitzWriter {
  /**
   * Returns an HTMLFormElement that will open a new stackblitz template with the example data when
   * called with submit().
   */
  constructStackblitzForm(type: string, exampleData: ExampleType): HTMLFormElement {
    const indexFile = `src%2Fapp%2Fapp.component.ts`;
    const form = this._createFormElement(indexFile);

    TAGS.forEach((tag, i) => this._appendFormInput(form, `tags[${i}]`, tag));
    this._appendFormInput(form, 'private', 'true');
    this._appendFormInput(form, 'description', exampleData.title);

    const appModuleContent = exampleData.files.find(f => f.file === 'app.module.ts').filecontent.default;
    exampleData.deps = exampleData.deps || [];

    const options: any = { type };

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
      exampleData.files.map(f => f.filecontent.default).some(content => content.indexOf('@angular/animations') !== -1)) {
      options.useAnimation = true;
    }

    if (appModuleContent.indexOf('ag-grid-angular') !== -1) {
      options.includeAgGrid = true;
    }

    if (exampleData.deps.indexOf('fontawesome') !== -1) {
      options.includeFontawesome = true;
    }

    if (appModuleContent.indexOf('@swimlane/ngx-datatable') !== -1) {
      options.includeNgxDatable = true;
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
      deps['@angular/cdk'] = materialVersion;
      deps['@angular/material'] = materialVersion;
    }

    if (options.includeAgGrid) {
      Object.assign(deps, dependencies['ag-grid']);
    }

    if (options.includeNgxDatable) {
      Object.assign(deps, dependencies['ngx-datatable']);
    }

    if (options.includeNgxTranslate) {
      Object.assign(deps, dependencies['ngx-translate']);
    }

    this._appendFormInput(form, 'dependencies', JSON.stringify(deps));

    [...TEMPLATE_FILES.core, ...TEMPLATE_FILES[options.type]].forEach(data => {
      this._addFileToForm(
        form,
        this._replaceExamplePlaceholderNames(data.file, data.filecontent.default, options),
        data.file,
        false,
      );
    });

    exampleData.files.forEach(data => {
      this._addFileToForm(
        form,
        this._replaceExamplePlaceholderNames(data.file, data.filecontent.default, options),
        data.file,
        data.file.indexOf('assets') !== 0,
      );
    });

    return form;
  }

  /** Constructs a new form element that will navigate to the stackblitz url. */
  _createFormElement(indexFile: string): HTMLFormElement {
    const form = document.createElement('form');
    form.action = `${STACKBLITZ_URL}?file=${indexFile}`;
    form.method = 'post';
    form.target = '_blank';
    return form;
  }

  /** Appends the name and value as an input to the form. */
  _appendFormInput(form: HTMLFormElement, name: string, value: string): void {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  /**
   * Adds the file text to the form.
   * @param form the html form you are appending to
   * @param data example metadata about the example
   * @param content file contents
   * @param filename file name of the example
   * @param path path to the src
   * @param prependApp whether to prepend the 'app' prefix to the path
   */
  _addFileToForm(form: HTMLFormElement, content: string, filename: string, prependApp = true) {
    if (prependApp) {
      filename = 'app/' + filename;
    }

    if (filename !== 'angular.json') {
      filename = 'src/' + filename;
    }

    this._appendFormInput(form, `files[${filename}]`, this._appendCopyright(filename, content));
  }

  _replaceExamplePlaceholderNames(fileName: string, filecontent: string, options): string {
    if (fileName === 'app.module.ts') {
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

      filecontent = filecontent.replace('declarations: [', `bootstrap: [AppComponent],\n  declarations: [`);
    } else if (fileName === 'styles.scss') {
      filecontent = `${filecontent}\nbody { padding: 10px; }`;

      if (options.type !== 'material' && options.includeMaterial) {
        filecontent = `${filecontent}\n@import '~@angular/material/prebuilt-themes/deeppurple-amber.css'; `;
      }

      if (options.includeAgGrid) {
        filecontent = `${filecontent}\n@import '~ag-grid-community/dist/styles/ag-grid.css'; `;
        filecontent = `${filecontent}\n@import '~ag-grid-community/dist/styles/ag-theme-balham.css'; `;
      }
    }

    if (fileName === 'index.html' && options.includeFontawesome) {
      filecontent = `<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">\n${filecontent}`;
    }

    filecontent = filecontent.replace(/_json/g, '.json');

    return filecontent;
  }

  _appendCopyright(filename: string, content: string) {
    if (filename.indexOf('.ts') > -1 || filename.indexOf('.scss') > -1) {
      content = `${content}\n\n/**  ${COPYRIGHT} */`;
    } else if (filename.indexOf('.html') > -1) {
      content = `${content}\n\n<!-- ${COPYRIGHT} -->`;
    }
    return content;
  }
}
