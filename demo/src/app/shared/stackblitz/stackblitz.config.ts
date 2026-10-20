import polyfillsTsSource from '../../../assets/stackblitz/polyfills.ts?raw' with { loader: 'text' };
import angularJsonSource from '../../../assets/stackblitz/angular_json?raw' with { loader: 'text' };
import mainTsSource from '../../../assets/stackblitz/main.ts?raw' with { loader: 'text' };
import indexHtmlSource from '../../../assets/stackblitz/index.html?raw' with { loader: 'text' };
import tsconfigJsonSource from '../../../assets/stackblitz/tsconfig_json?raw' with { loader: 'text' };
import tsconfigAppJsonSource from '../../../assets/stackblitz/tsconfig.app_json?raw' with { loader: 'text' };
import faviconIcoSource from '../../../favicon.ico?raw' with { loader: 'text' };
import { ExampleType } from '../example-viewer/example-viewer.component';

export const COPYRIGHT = `Copyright 2025 Formly. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://github.com/ngx-formly/ngx-formly/blob/main/LICENSE`;

export const angularVersion = '^22.0.0';
export const formlyVersion = '^11.0.0';

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
    tslib: '^2.3.1',
    '@ngx-formly/core': formlyVersion,
  },
  bootstrap: {
    '@ngx-formly/bootstrap': formlyVersion,
    bootstrap: '^5.3.6',
    '@ng-bootstrap/ng-bootstrap': '^21.0.0',
    '@angular/cdk': angularVersion,
    '@popperjs/core': '^2.11.8',
  },
  material: { '@ngx-formly/material': formlyVersion },
  kendo: {
    '@ngx-formly/kendo': formlyVersion,
    '@progress/kendo-angular-dateinputs': '^25.3.0',
    '@progress/kendo-angular-common': '^25.3.0',
    '@progress/kendo-angular-dropdowns': '^25.3.0',
    '@progress/kendo-angular-inputs': '^25.3.0',
    '@progress/kendo-angular-intl': '^25.3.0',
    '@progress/kendo-angular-l10n': '^25.3.0',
    '@progress/kendo-angular-label': '^25.3.0',
    '@progress/kendo-angular-popup': '^25.3.0',
    '@progress/kendo-angular-treeview': '^25.3.0',
    '@progress/kendo-drawing': '^1.25.0',
    '@progress/kendo-licensing': '^1.11.0',
    '@progress/kendo-theme-default': '^14.6.1',
  },
  primeng: {
    '@ngx-formly/primeng': formlyVersion,
    '@angular/router': angularVersion,
    '@angular/cdk': angularVersion,
    primeflex: '^3.2.0',
    primeicons: '^7.0.0',
    primeng: '^21.1.10',
    '@primeuix/themes': '^2.0.2',
  },
  ionic: { '@ngx-formly/ionic': formlyVersion, '@ionic/angular': '^9.0.0', '@angular/router': angularVersion },
  'ng-zorro-antd': {
    '@ngx-formly/ng-zorro-antd': formlyVersion,
    '@angular/cdk': angularVersion,
    'ng-zorro-antd': '^22.1.2',
  },
  // non UI framework libraries
  'ag-grid': { 'ag-grid-angular': '^33.1.0', 'ag-grid-community': '^33.1.0' },
  'ngx-translate': { '@ngx-translate/core': '^16.0.4', '@ngx-translate/http-loader': '^16.0.1' },
};

// shortcut: PrimeNG 21 declares Angular 21 peers, remove once a community release accepts Angular 22.
export const primengOverrides = {
  primeng: {
    '@angular/cdk': '$@angular/cdk',
    '@angular/common': '$@angular/common',
    '@angular/core': '$@angular/core',
    '@angular/forms': '$@angular/forms',
    '@angular/platform-browser': '$@angular/platform-browser',
    '@angular/router': '$@angular/router',
  },
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
    { file: 'polyfills.ts', filecontent: polyfillsTsSource },
    { file: 'angular.json', filecontent: angularJsonSource },
    { file: 'main.ts', filecontent: mainTsSource },
    { file: 'index.html', filecontent: indexHtmlSource },
    { file: 'tsconfig.json', filecontent: tsconfigJsonSource },
    { file: 'tsconfig.app.json', filecontent: tsconfigAppJsonSource },
    { file: 'favicon.ico', filecontent: faviconIcoSource },
  ],
  bootstrap: [{ file: 'styles.scss', filecontent: `@import 'bootstrap/scss/bootstrap.scss';` }],
  material: [
    {
      file: 'styles.scss',
      filecontent: `@import '@angular/material/prebuilt-themes/deeppurple-amber.css';`,
    },
  ],
  kendo: [{ file: 'styles.scss', filecontent: `@import '@progress/kendo-theme-default/dist/all.css';` }],
  primeng: [
    {
      file: 'styles.scss',
      filecontent: `
@import "primeflex/primeflex.css";
@import "primeicons/primeicons.css";
      `,
    },
  ],
  ionic: [
    {
      file: 'styles.scss',
      filecontent: `
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
  ],
  'ng-zorro-antd': [
    {
      file: 'styles.scss',
      filecontent: `
@import "ng-zorro-antd/ng-zorro-antd.min.css";
      `,
    },
  ],
};
