import { Injectable } from '@angular/core';
import { VERSION } from '@angular/material';

const STACKBLITZ_URL = 'https://run.stackblitz.com/api/angular/v1';

const COPYRIGHT =
  `Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license`;

const TEMPLATE_FILES = {
  core: [
    { file: 'polyfills.ts', filecontent: require('!!raw-loader!../../../assets/stackblitz/polyfills.ts') },
    { file: '.angular-cli.json', filecontent: require('!!raw-loader!../../../assets/stackblitz/.angular-cli.json') },
    { file: 'main.ts', filecontent: require('!!raw-loader!../../../assets/stackblitz/main.ts') },
  ],
  bootstrap: [
    { file: 'index.html', filecontent: require('!!raw-loader!../../../assets/stackblitz/bootstrap/index.html') },
    { file: 'styles.scss', filecontent: require('!!raw-loader!../../../assets/stackblitz/styles.scss') },
  ],
  material: [
    { file: 'index.html', filecontent: require('!!raw-loader!../../../assets/stackblitz/index.html') },
    { file: 'styles.scss', filecontent: `@import '~@angular/material/prebuilt-themes/deeppurple-amber.css';` },
  ],
  kendo: [
    { file: 'index.html', filecontent: require('!!raw-loader!../../../assets/stackblitz/index.html') },
    { file: 'styles.scss', filecontent: `@import '~@progress/kendo-theme-default/dist/all.css';` },
  ],
  primeng: [
    { file: 'index.html', filecontent: require('!!raw-loader!../../../assets/stackblitz/index.html') },
    { file: 'styles.scss', filecontent: `
      @import '~primeng/resources/primeng.min.css';
      @import '~primeng/resources/themes/omega/theme.css';
    ` },
  ],
  ionic: [
    { file: 'index.html', filecontent: require('!!raw-loader!../../../assets/stackblitz/index.html') },
    { file: 'styles.scss', filecontent: `@import '~ionic-angular/css/ionic.css';` },
  ],
};

const TAGS: string[] = ['angular', 'material', 'example'];
const angularVersion = '^5.0.0';
const materialVersion = '^5.0.0';
const formlyVersion = '^2.0.0';

const dependencies = {
  core: {
    '@angular/common': angularVersion,
    '@angular/compiler': angularVersion,
    '@angular/core': angularVersion,
    '@angular/forms': angularVersion,
    '@angular/platform-browser': angularVersion,
    '@angular/platform-browser-dynamic': angularVersion,
    'core-js': '^2.4.1',
    'rxjs': '^5.5.2',
    'zone.js': '^0.8.14',

    '@ngx-formly/core': formlyVersion,
  },
  bootstrap: {
    '@ngx-formly/bootstrap': formlyVersion,
  },
  material: {
    '@ngx-formly/material': formlyVersion,
  },
  kendo: {
    '@ngx-formly/kendo': formlyVersion,
  },
  primeng: {
    '@ngx-formly/primeng': formlyVersion,
  },
  ionic: {
    '@ngx-formly/ionic': formlyVersion,
  },
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
  constructStackblitzForm(files: any): HTMLFormElement {

    const indexFile = `app%2Fapp.component.ts`;
    const form = this._createFormElement(indexFile);

    TAGS.forEach((tag, i) => this._appendFormInput(form, `tags[${i}]`, tag));
    this._appendFormInput(form, 'private', 'true');

    const appModuleContent = files.find(f => f.file === 'app.module.ts').filecontent;
    const options: any = {
      includeMaterial: appModuleContent.indexOf('@angular/material') !== -1
        || appModuleContent.indexOf('@ngx-formly/material') !== -1,
      useAnimation: appModuleContent.indexOf('@angular/material') !== -1
        || appModuleContent.indexOf('@ngx-formly/material') !== -1,
    };

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
          data,
          this._replaceExamplePlaceholderNames(data.file, data.filecontent, options),
          data.file,
          'app',
          false,
        );
      });

    files.forEach(data => {
      this._addFileToForm(
        form,
        data,
        this._replaceExamplePlaceholderNames(data.file, data.filecontent, options),
        data.file,
        'app',
        true,
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
    data: any,
    content: string,
    filename: string,
    path: string,
    prependApp = true) {
    if (prependApp) {
      filename = 'app/' + filename;
    }

    this._appendFormInput(form, `files[${filename}]`, this._appendCopyright(filename, content));
  }

  _replaceExamplePlaceholderNames(fileName: string, filecontent: string, options): string {
    if (fileName === 'app.module.ts') {
      if (options.useAnimation) {
        filecontent = filecontent.replace('@angular/common', '@angular/platform-browser/animations');
        filecontent = filecontent.replace(/CommonModule/g, 'BrowserAnimationsModule');
      } else {
        filecontent = filecontent.replace('@angular/common', '@angular/platform-browser');
        filecontent = filecontent.replace(/CommonModule/g, 'BrowserModule');
      }

      filecontent = filecontent.replace('declarations: [', `bootstrap: [AppComponent],
  declarations: [`);
    } else if (fileName === 'styles.scss' && options.type !== 'material' && options.includeMaterial) {

      filecontent = `${filecontent}
      @import '~@angular/material/prebuilt-themes/deeppurple-amber.css';
      `;
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
