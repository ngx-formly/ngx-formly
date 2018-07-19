import { Injectable } from '@angular/core';
import { ExampleType } from '../example-viewer/example-viewer.component';

const STACKBLITZ_URL = 'https://run.stackblitz.com/api/angular/v1';

const COPYRIGHT =
  `Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license`;

const TEMPLATE_FILES = {
  core: [
    { file: 'polyfills.ts', filecontent: require('!!raw-loader!../../../assets/stackblitz/polyfills.ts') },
    { file: 'angular.json', filecontent: require('!!raw-loader!../../../assets/stackblitz/angular_json') },
    { file: 'main.ts', filecontent: require('!!raw-loader!../../../assets/stackblitz/main.ts') },
    { file: 'index.html', filecontent: require('!!raw-loader!../../../assets/stackblitz/index.html') },
  ],
  bootstrap: [
    { file: 'styles.scss', filecontent: `@import '~bootstrap/scss/bootstrap.scss';` },
  ],
  material: [
    { file: 'styles.scss', filecontent: `@import '~@angular/material/prebuilt-themes/deeppurple-amber.css';` },
  ],
  kendo: [
    { file: 'styles.scss', filecontent: `@import '~@progress/kendo-theme-default/dist/all.css';` },
  ],
  primeng: [
    { file: 'styles.scss', filecontent: `
      @import '~primeng/resources/primeng.min.css';
      @import '~primeng/resources/themes/omega/theme.css';
    ` },
  ],
  ionic: [
    { file: 'styles.scss', filecontent: `@import '~ionic-angular/css/ionic.css';` },
  ],
};

const TAGS: string[] = ['angular', 'formly', 'example'];
const angularVersion = '^6.0.0';
const materialVersion = '^6.0.0';
const formlyVersion = '^5.0.0-alpha';

const dependencies = {
  core: {
    '@angular/common': angularVersion,
    '@angular/compiler': angularVersion,
    '@angular/core': angularVersion,
    '@angular/forms': angularVersion,
    '@angular/platform-browser': angularVersion,
    '@angular/platform-browser-dynamic': angularVersion,
    'core-js': '^2.4.1',
    'rxjs': '^6.0.0',
    'rxjs-compat': '^6.0.0',
    'zone.js': '^0.8.14',
    'tslib': '^1.7.0',

    '@ngx-formly/core': formlyVersion,
  },
  bootstrap: {
    '@ngx-formly/bootstrap': formlyVersion,
    'bootstrap': '^4.0.0',
    'popper.js': '^1.14',
    'jquery': '^3',
  },
  material: {
    '@ngx-formly/material': formlyVersion,
  },
  kendo: {
    '@ngx-formly/kendo': formlyVersion,
    '@progress/kendo-theme-default': '^2.50.0',
    '@progress/kendo-angular-dropdowns': '^2.1.0',
    '@progress/kendo-angular-l10n': '^1.0.0',
  },
  primeng: {
    '@ngx-formly/primeng': formlyVersion,
    'primeng': '^5.2.0',
  },
  ionic: {
    '@ngx-formly/ionic': formlyVersion,
    'ionic-angular': '^3.9.0',
  },
};

const ngModule = {
  bootstrap: 'FormlyBootstrapModule',
  material: 'FormlyMaterialModule',
  kendo: 'FormlyKendoModule',
  primeng: 'FormlyPrimeNGModule',
  ionic: 'FormlyIonicModule',
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

    const appModuleContent = exampleData.files.find(f => f.file === 'app.module.ts').filecontent;

    const options: any = { type };

    if (['bootstrap', 'material', 'kendo', 'ionic', 'primeng'].indexOf(options.type) === -1) {
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
      }
    }

    if (['primeng', 'material'].indexOf(options.type) !== -1 || appModuleContent.indexOf('@angular/material') !== -1) {
      options.includeMaterial = true;
      options.useAnimation = true;
    }

    if (!options.useAnimation && exampleData.files.map(f => f.filecontent).some(content => content.indexOf('@angular/animations') !== -1)) {
      options.useAnimation = true;
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

    this._appendFormInput(form, 'dependencies', JSON.stringify(deps));

    [
      ...TEMPLATE_FILES.core,
      ...TEMPLATE_FILES[options.type],
    ]
      .forEach(data => {
        this._addFileToForm(
          form,
          this._replaceExamplePlaceholderNames(data.file, data.filecontent, options),
          data.file,
          false,
        );
      });

    exampleData.files.forEach(data => {
      this._addFileToForm(
        form,
        this._replaceExamplePlaceholderNames(data.file, data.filecontent, options),
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
  _addFileToForm(form: HTMLFormElement,
    content: string,
    filename: string,
    prependApp = true) {
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
        filecontent = filecontent.replace(`'@angular/common';`, `'@angular/common';\nimport { IonicModule } from 'ionic-angular';`);
        filecontent = filecontent.replace(`FormlyModule.forRoot`, `IonicModule.forRoot(AppComponent),\n    FormlyModule.forRoot`);
      }

      if (filecontent.indexOf(`@ngx-formly/${options.type}'`) === -1) {
        filecontent = filecontent.replace(`'@ngx-formly/core';`, `'@ngx-formly/core';\nimport { ${ngModule[options.type]} } from '@ngx-formly/${options.type}';`);
        filecontent = filecontent.replace(`FormlyModule.forRoot`, `${ngModule[options.type]},\n    FormlyModule.forRoot`);
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
    } else if (fileName === 'user.service.ts') {
      filecontent = filecontent.replace(/_json/g, '.json');
    }

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
