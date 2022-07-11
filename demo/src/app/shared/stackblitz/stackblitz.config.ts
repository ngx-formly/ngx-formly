import { ExampleType } from '../example-viewer/example-viewer.component';

export const COPYRIGHT = `Copyright 2021 Formly. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://github.com/ngx-formly/ngx-formly/blob/main/LICENSE`;

export const angularVersion = '^14.0.0';
export const formlyVersion = 'next';

export const dependencies: { [id: string]: { [id: string]: string } } = {
  core: {
    '@angular/common': angularVersion,
    '@angular/compiler': angularVersion,
    '@angular/core': angularVersion,
    '@angular/forms': angularVersion,
    '@angular/platform-browser': angularVersion,
    '@angular/platform-browser-dynamic': angularVersion,
    '@angular/animations': angularVersion,
    '@angular/router': angularVersion,
    'core-js': '^3.19.1',
    rxjs: '^7.0.0',
    'zone.js': '~0.11.4',
    tslib: '^2.3.1',
    '@ngx-formly/core': formlyVersion,
  },
  bootstrap: {
    '@ngx-formly/bootstrap': formlyVersion,
    bootstrap: '^5.1.3',
    '@popperjs/core': '*',
  },
  material: {
    '@ngx-formly/material': formlyVersion,
  },
  kendo: {
    '@ngx-formly/kendo': formlyVersion,
    '@progress/kendo-angular-common': '^3.1.0',
    '@progress/kendo-angular-dropdowns': '^7.0.2',
    '@progress/kendo-angular-inputs': '^9.0.3',
    '@progress/kendo-angular-intl': '^4.0.1',
    '@progress/kendo-angular-l10n': '^4.0.0',
    '@progress/kendo-angular-label': '^4.0.0',
    '@progress/kendo-angular-popup': '^5.0.0',
    '@progress/kendo-angular-treeview': '^7.1.0',
    '@progress/kendo-drawing': '^1.16.1',
    '@progress/kendo-licensing': '^1.2.1',
    '@progress/kendo-theme-default': '^5.5.0',
  },
  primeng: {
    '@ngx-formly/primeng': formlyVersion,
    '@angular/router': angularVersion,
    '@angular/cdk': angularVersion,
    primeflex: '3.1.0',
    primeicons: '^5.0.0',
    primeng: '^13.0.0',
  },
  ionic: {
    '@ngx-formly/ionic': formlyVersion,
    '@ionic/angular': '^6.0.1',
    '@angular/router': angularVersion,
  },
  'ng-zorro-antd': {
    '@ngx-formly/ng-zorro-antd': formlyVersion,
    '@angular/cdk': angularVersion,
    'ng-zorro-antd': '^13.0.0',
  },
  // non UI framework libraries
  'ag-grid': {
    'ag-grid-angular': '*',
    'ag-grid-community': '*',
  },
  'ngx-datatable': {
    '@swimlane/ngx-datatable': '*',
  },
  'ngx-translate': {
    '@ngx-translate/core': '*',
    '@ngx-translate/http-loader': '*',
  },
};

export const ngModule: { [id: string]: string } = {
  bootstrap: 'FormlyBootstrapModule',
  material: 'FormlyMaterialModule',
  kendo: 'FormlyKendoModule',
  primeng: 'FormlyPrimeNGModule',
  ionic: 'FormlyIonicModule',
  'ng-zorro-antd': 'FormlyNgZorroAntdModule',
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
@import "~primeng/resources/themes/saga-blue/theme.css";
@import "~primeng/resources/primeng.min.css";
@import "~primeflex/primeflex.css";
@import "~primeicons/primeicons.css";
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
@import "~ng-zorro-antd/ng-zorro-antd.min.css";
      `,
      },
    },
  ],
};
