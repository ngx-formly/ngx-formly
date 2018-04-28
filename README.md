<img src="https://raw.githubusercontent.com/formly-js/angular-formly/master/other/logo/angular-formly-logo-64px.png" alt="angular-formly logo" title="angular-formly" align="right" width="64" height="64" />

# @ngx-formly
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)
[![All Contributors](https://img.shields.io/badge/all_contributors-13-orange.svg?style=flat-square)](#contributors)
[![Stories in Ready](https://badge.waffle.io/formly-js/ngx-formly.png?label=ready&title=Ready)](https://waffle.io/formly-js/ngx-formly)

Status:
[![Build Status](https://travis-ci.org/formly-js/ngx-formly.svg?branch=master)](https://travis-ci.org/formly-js/ngx-formly)
[![npm version](https://badge.fury.io/js/%40ngx-formly%2Fcore.svg)](https://badge.fury.io/js/%40ngx-formly%2Fcore)
[![devDependencies Status](https://david-dm.org/formly-js/ng-formly/dev-status.svg)](https://david-dm.org/formly-js/ng-formly?type=dev)
[![Package Quality](http://npm.packagequality.com/shield/ng-formly.png)](http://packagequality.com/#?package=ng-formly)
[![Known Vulnerabilities](https://snyk.io/test/github/formly-js/ng-formly/badge.svg)](https://snyk.io/test/github/formly-js/ng-formly)
[![codecov.io](http://codecov.io/github/formly-js/ng-formly/coverage.svg?branch=master)](http://codecov.io/github/formly-js/ng-formly?branch=master)

Links:
[![Gitter](https://badges.gitter.im/formly-js/angular2-formly.svg)](https://gitter.im/formly-js/angular2-formly?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Ngx Formly is a dynamic JSON powered form library for Angular (mainly based an on [Angular Reactive Forms](https://angular.io/guide/reactive-forms)) that bring unmatched maintainability to your application's forms.

**Supported UI libs**

| UI                                                |   |
| ------------------------------------------------- | - |
| [Bootstrap](https://getbootstrap.com)             | ✅ |
| [Ionic](https://ionicframework.com)               | ✅ |
| [Kendo](http://www.telerik.com/kendo-angular-ui)  | ✅ |
| [Material2](https://github.com/angular/material2) | ✅ |
| [PrimeNG](http://primefaces.org/primeng/#/)       | ✅ |
| [NativeScript](https://www.nativescript.org)      | ❌ |

**Which Version to use?**

| Angular version | Formly version       |
| --------------- | -------------------- |
| Angular >= 5    | @ngx-formly/core@3.x |
| Angular >= 4    | @ngx-formly/core@2.x |
| Angular >= 2    | ng-formly@1.x        |

#### Quick links
* [Documentation, demos, and guides](https://formly-js.github.io/ngx-formly)
* StackBlitz Template
  * [UI Bootstrap](https://stackblitz.com/edit/ngx-formly-ui-bootstrap)
  * [UI Material](https://stackblitz.com/edit/ngx-formly-ui-material)
  * [UI Ionic](https://stackblitz.com/edit/ngx-formly-ui-ionic)
  * [UI PrimeNG](https://stackblitz.com/edit/ngx-formly-ui-primeng)
  * [UI Kendo](https://stackblitz.com/edit/ngx-formly-ui-kendo)

## Quick Start

Follow these steps to get started with Ngx Formly. Also check out our [demos](https://formly-js.github.io/ngx-formly) for further examples.

#### 1. Install @angular/forms and @ngx-formly/core packages:
```bash
  npm install @angular/forms @ngx-formly/core --save
```

#### 2. Choose and install your UI (pre-defined types/templates) package:

- [Material2](https://github.com/angular/material2):
  1. Ensure you have already installed material2 https://material.angular.io/guide/getting-started
  2. Install `@ngx-formly/material`
```bash
  npm install @ngx-formly/material --save
```

- [Bootstrap](https://getbootstrap.com):
  ```bash
    npm install @ngx-formly/bootstrap --save
  ```

- [Ionic](https://ionicframework.com):
  ```bash
    npm install @ngx-formly/ionic --save
  ```

- [PrimeNG](http://primefaces.org/primeng/#/):
  ```bash
    npm install @ngx-formly/primeng --save
  ```

- [Kendo](http://www.telerik.com/kendo-angular-ui):
  ```bash
    npm install @ngx-formly/kendo --save
  ```

#### 3. Import the `FormlyModule` and UI (pre-defined types/templates):

```typescript
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyBootstrapModule} from '@ngx-formly/bootstrap';

// for material2 import `FormlyMaterialModule`:
// import {FormlyMaterialModule} from '@ngx-formly/material';

// for ionic import `FormlyIonicModule`:
// import {FormlyIonicModule} from '@ngx-formly/ionic';

// for primeng import `FormlyPrimeNGModule`:
// import {FormlyPrimeNGModule} from '@ngx-formly/primeng';

// for kendo import `FormlyKendoModule`:
// import {FormlyKendoModule} from '@ngx-formly/kendo';

@NgModule({
  imports: [
    ...,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyBootstrapModule,

    // for material2:
    // FormlyMaterialModule

    // for ionic:
    // FormlyIonicModule

    // for primeng:
    // FormlyPrimeNGModule

    // for kendo:
    // FormlyKendoModule
  ],
})
export class AppModule {}
```

#### 3. Define the form config in your component:

```typescript
import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';

@Component({
  selector: 'app',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit(model)">
      <formly-form [form]="form" [fields]="fields" [model]="model">
        <button type="submit" class="btn btn-default">Submit</button>
      </formly-form>
    </form>
  `,
})
export class AppComponent {
  form = new FormGroup({});
  model = { email: 'email@gmail.com' };
  fields: FormlyFieldConfig[] = [{
    key: 'email',
    type: 'input',
    templateOptions: {
      type: 'email',
      label: 'Email address',
      placeholder: 'Enter email',
      required: true,
    }
  }];

  submit(model) {
    console.log(model);
  }
}
```

From there, it's just JavaScript. Allowing for DRY, maintainable, reusable forms.

## Roadmap

See the [issues labeled enhancement](https://github.com/formly-js/angular2-formly/labels/enhancement)

## Thanks

A special thanks to [Kent C. Dodds](https://twitter.com/kentcdodds) for giving me opportunity to work on this.
This library is maintained (with love) by me, [Mohammed Zama Khan](https://twitter.com/mohamedzamakhan).
Thanks to all [contributors](https://github.com/formly-js/angular2-formly/graphs/contributors)!
If you're trying to find angular-formly, go [here](https://github.com/formly-js/angular-formly)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
[<img alt="aitboudad" src="https://avatars2.githubusercontent.com/u/1753742?v=4&s=117" width="117">](https://github.com/aitboudad)[<img alt="mohammedzamakhan" src="https://avatars3.githubusercontent.com/u/2327532?v=4&s=117" width="117">](https://github.com/mohammedzamakhan)[<img alt="divyakumarjain" src="https://avatars2.githubusercontent.com/u/2039134?v=4&s=117" width="117">](https://github.com/divyakumarjain)[<img alt="couzic" src="https://avatars2.githubusercontent.com/u/1380322?v=4&s=117" width="117">](https://github.com/couzic)[<img alt="franzeal" src="https://avatars3.githubusercontent.com/u/7455769?v=4&s=117" width="117">](https://github.com/franzeal)[<img alt="beeman" src="https://avatars3.githubusercontent.com/u/36491?v=4&s=117" width="117">](https://github.com/beeman)

[<img alt="juristr" src="https://avatars3.githubusercontent.com/u/542458?v=4&s=117" width="117">](https://github.com/juristr)[<img alt="dwaldrum" src="https://avatars2.githubusercontent.com/u/386721?v=4&s=117" width="117">](https://github.com/dwaldrum)[<img alt="Krustie101" src="https://avatars2.githubusercontent.com/u/1636728?v=4&s=117" width="117">](https://github.com/Krustie101)[<img alt="MarcosEllys" src="https://avatars3.githubusercontent.com/u/6751242?v=4&s=117" width="117">](https://github.com/MarcosEllys)[<img alt="thorgod" src="https://avatars3.githubusercontent.com/u/13910170?v=4&s=117" width="117">](https://github.com/thorgod)[<img alt="AlexTalcura" src="https://avatars2.githubusercontent.com/u/20095773?v=4&s=117" width="117">](https://github.com/AlexTalcura)

[<img alt="Dayvisson" src="https://avatars1.githubusercontent.com/u/12189515?v=4&s=117" width="117">](https://github.com/Dayvisson)[<img alt="jrgleason" src="https://avatars3.githubusercontent.com/u/1319151?v=4&s=117" width="117">](https://github.com/jrgleason)[<img alt="n3xus" src="https://avatars0.githubusercontent.com/u/510213?v=4&s=117" width="117">](https://github.com/n3xus)[<img alt="kentcdodds" src="https://avatars0.githubusercontent.com/u/1500684?v=4&s=117" width="117">](https://github.com/kentcdodds)[<img alt="LennardWesterveld" src="https://avatars2.githubusercontent.com/u/1076589?v=4&s=117" width="117">](https://github.com/LennardWesterveld)[<img alt="waffle-iron" src="https://avatars2.githubusercontent.com/u/6912981?v=4&s=117" width="117">](https://github.com/waffle-iron)

[<img alt="MathijsHoogland" src="https://avatars2.githubusercontent.com/u/7372934?v=4&s=117" width="117">](https://github.com/MathijsHoogland)[<img alt="Pouja" src="https://avatars3.githubusercontent.com/u/2385144?v=4&s=117" width="117">](https://github.com/Pouja)[<img alt="Riron" src="https://avatars3.githubusercontent.com/u/5145523?v=4&s=117" width="117">](https://github.com/Riron)[<img alt="Ronen-dev" src="https://avatars3.githubusercontent.com/u/12510911?v=4&s=117" width="117">](https://github.com/Ronen-dev)[<img alt="blowsie" src="https://avatars2.githubusercontent.com/u/308572?v=4&s=117" width="117">](https://github.com/blowsie)[<img alt="samtsai" src="https://avatars0.githubusercontent.com/u/225526?v=4&s=117" width="117">](https://github.com/samtsai)

[<img alt="Tom-V" src="https://avatars2.githubusercontent.com/u/322654?v=4&s=117" width="117">](https://github.com/Tom-V)[<img alt="danielcrisp" src="https://avatars1.githubusercontent.com/u/1104814?v=4&s=117" width="117">](https://github.com/danielcrisp)[<img alt="francisco-sanchez-molina" src="https://avatars3.githubusercontent.com/u/9049706?v=4&s=117" width="117">](https://github.com/francisco-sanchez-molina)[<img alt="TheMcMurder" src="https://avatars1.githubusercontent.com/u/3059715?v=4&s=117" width="117">](https://github.com/TheMcMurder)
<!-- ALL-CONTRIBUTORS-LIST:END -->
