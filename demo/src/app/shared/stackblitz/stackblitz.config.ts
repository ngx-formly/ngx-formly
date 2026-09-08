/* eslint-disable @typescript-eslint/no-require-imports */
import { ExampleType } from '../example-viewer/example-viewer.component';

export const COPYRIGHT = `Copyright 2025 Formly. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://github.com/ngx-formly/ngx-formly/blob/main/LICENSE`;

export const angularVersion = '^20.0.0';
export const formlyVersion = '^8.0.0';

export const dependencies: { [id: string]: { [id: string]: string } } = {
  core: {
    '@angular/common': angularVersion,
    '@angular/compiler': angularVersion,
    '@angular/core': angularVersion,
    '@angular/forms': angularVersion,
    '@angular/localize': angularVersion,
    '@angular/platform-browser': angularVersion,
    '@angular/animations': angularVersion,
    '@angular/router': angularVersion,
    rxjs: '^7.8.0',
    'zone.js': '~0.15.0',
    tslib: '^2.3.1',
    '@ngx-formly/core': formlyVersion,
  },
  bootstrap: {
    '@ngx-formly/bootstrap': formlyVersion,
    bootstrap: '^5.3.6',
    '@ng-bootstrap/ng-bootstrap': '^19.0.1',
    '@angular/cdk': angularVersion,
    '@popperjs/core': '*',
  },
  material: { '@ngx-formly/material': formlyVersion },
  kendo: {
    '@ngx-formly/kendo': formlyVersion,
    '@progress/kendo-angular-dateinputs': '^19.3.0',
    '@progress/kendo-angular-common': '^19.3.0',
    '@progress/kendo-angular-dropdowns': '^19.3.0',
    '@progress/kendo-angular-inputs': '^19.3.0',
    '@progress/kendo-angular-intl': '^19.3.0',
    '@progress/kendo-angular-l10n': '^19.3.0',
    '@progress/kendo-angular-label': '^19.3.0',
    '@progress/kendo-angular-popup': '^19.3.0',
    '@progress/kendo-angular-treeview': '^19.3.0',
    '@progress/kendo-drawing': '^1.16.1',
    '@progress/kendo-licensing': '^1.2.1',
    '@progress/kendo-theme-default': '^10.2.0',
  },
  primeng: {
    '@ngx-formly/primeng': formlyVersion,
    '@angular/router': angularVersion,
    '@angular/cdk': angularVersion,
    primeflex: '^3.2.0',
    primeicons: '^7.0.0',
    primeng: '^20.4.0',
    '@primeuix/themes': '^1.2.5',
  },
  ionic: { '@ngx-formly/ionic': formlyVersion, '@ionic/angular': '^8.0.0', '@angular/router': angularVersion },
  'ng-zorro-antd': {
    '@ngx-formly/ng-zorro-antd': formlyVersion,
    '@angular/cdk': angularVersion,
    'ng-zorro-antd': '^20.4.4',
  },
  // non UI framework libraries
  'ag-grid': { 'ag-grid-angular': '*', 'ag-grid-community': '*' },
  'ngx-translate': { '@ngx-translate/core': '*', '@ngx-translate/http-loader': '*' },
};

export const ngProvider: { [id: string]: string } = {
  bootstrap: 'withFormlyBootstrap',
  material: 'withFormlyMaterial',
  kendo: 'withFormlyKendo',
  primeng: 'withFormlyPrimeNG',
  ionic: 'withFormlyIonic',
  'ng-zorro-antd': 'withFormlyNgZorroAntd',
};

export const TEMPLATE_FILES: { [id: string]: ExampleType['files'] } = {
  core: [
    { file: 'polyfills.ts', filecontent: require('!!raw-loader!@assets/stackblitz/polyfills.ts') },
    { file: 'angular.json', filecontent: require('!!raw-loader!@assets/stackblitz/angular_json') },
    { file: 'main.ts', filecontent: require('!!raw-loader!@assets/stackblitz/main.ts') },
    { file: 'index.html', filecontent: require('!!raw-loader!@assets/stackblitz/index.html') },
    { file: 'tsconfig.json', filecontent: require('!!raw-loader!@assets/stackblitz/tsconfig_json') },
    { file: 'tsconfig.app.json', filecontent: require('!!raw-loader!@assets/stackblitz/tsconfig.app_json') },
    { file: 'favicon.ico', filecontent: require('!!raw-loader!@assets/../favicon.ico') },
  ],
  bootstrap: [{ file: 'styles.scss', filecontent: { default: `@import 'bootstrap/scss/bootstrap.scss';` } }],
  material: [
    {
      file: 'styles.scss',
      filecontent: { default: `@import '@angular/material/prebuilt-themes/deeppurple-amber.css';` },
    },
  ],
  kendo: [{ file: 'styles.scss', filecontent: { default: `@import '@progress/kendo-theme-default/dist/all.css';` } }],
  primeng: [
    {
      file: 'styles.scss',
      filecontent: {
        default: `
@import "primeflex/primeflex.css";
@import "primeicons/primeicons.css";
      `,
      },
    },
  ],
  ionic: [
    {
      file: 'styles.scss',
      filecontent: {
        default: `
@import "@ionic/angular/css/core.css";
@import "@ionic/angular/css/normalize.css";
@import "@ionic/angular/css/structure.css";
@import "@ionic/angular/css/typography.css";

@import "@ionic/angular/css/padding.css";
@import "@ionic/angular/css/float-elements.css";
@import "@ionic/angular/css/text-alignment.css";
@import "@ionic/angular/css/flex-utils.css";
      `,
      },
    },
  ],
  'ng-zorro-antd': [
    {
      file: 'styles.scss',
      filecontent: {
        default: `
@import "ng-zorro-antd/ng-zorro-antd.min.css";
      `,
      },
    },
  ],
};
