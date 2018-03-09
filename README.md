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


@ngx-formly is an Angular module which has a Components to help customize and render JavaScript/JSON configured forms.
The `formly-form` Component and the `FormlyConfig` service are very powerful and bring unmatched maintainability to your
application's forms.

## Quick Start

Follow these steps to get started with ng-formly. Also check out our [demos](https://formly-js.github.io/ngx-formly) for further examples.

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

#### 3. Import the `FormlyModule` and UI (pre-defined types/templates):

```typescript
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyBootstrapModule} from '@ngx-formly/bootstrap';

// for material2 import `FormlyMaterialModule`:
// import {FormlyMaterialModule} from '@ngx-formly/material';

@NgModule({
  imports: [
    ...,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyBootstrapModule,

    // for material2 use:
    // FormlyMaterialModule
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
    <form [formGroup]="form" (ngSubmit)="submit(userModel)">
      <formly-form [model]="userModel" [fields]="userFields">
        <button type="submit" class="btn btn-default">Submit</button>
      </formly-form>
    </form>
  `,
})
export class AppComponent {
  form = new FormGroup({});
  userModel = { email: 'email@gmail.com' };
  userFields: Array<FormlyFieldConfig> = [{
    key: 'email',
    type: 'input',
    templateOptions: {
      type: 'email',
      label: 'Email address',
      placeholder: 'Enter email',
      required: true,
    }
  }];

  submit(user) {
    console.log(user);
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
| [<img src="https://avatars.githubusercontent.com/u/2327532?v=3" width="100px;"/><br /><sub>Zama Khan Mohammed</sub>](https://www.linkedin.com/in/mohammedzamakhan)<br />[📖](https://github.com/formly-js/ng-formly/commits?author=mohammedzamakhan) [💻](https://github.com/formly-js/ng-formly/commits?author=mohammedzamakhan) 👀 💁 🚇 🔧 | [<img src="https://avatars.githubusercontent.com/u/1753742?v=3" width="100px;"/><br /><sub>Abdellatif Ait boudad</sub>](https://github.com/aitboudad)<br />[💻](https://github.com/formly-js/ng-formly/commits?author=aitboudad) [📖](https://github.com/formly-js/ng-formly/commits?author=aitboudad) [⚠️](https://github.com/formly-js/ng-formly/commits?author=aitboudad) 👀 💁 | [<img src="https://avatars.githubusercontent.com/u/2039134?v=3" width="100px;"/><br /><sub>divyakumarjain</sub>](https://github.com/divyakumarjain)<br />[💻](https://github.com/formly-js/ng-formly/commits?author=divyakumarjain) [📖](https://github.com/formly-js/ng-formly/commits?author=divyakumarjain) 🔌 👀 💁 | [<img src="https://avatars.githubusercontent.com/u/2385144?v=3" width="100px;"/><br /><sub>Pouja</sub>](https://github.com/Pouja)<br />[💻](https://github.com/formly-js/ng-formly/commits?author=Pouja) 👀 | [<img src="https://avatars.githubusercontent.com/u/464895?v=3" width="100px;"/><br /><sub>Caleb Kniffen</sub>](http://twitter.com/ckniffty)<br />[🐛](https://github.com/formly-js/ng-formly/issues?q=author%3Ackniffen) | [<img src="https://avatars.githubusercontent.com/u/5145523?v=3" width="100px;"/><br /><sub>Riron</sub>](https://github.com/Riron)<br />[🐛](https://github.com/formly-js/ng-formly/issues?q=author%3ARiron) | [<img src="https://avatars.githubusercontent.com/u/645187?v=3" width="100px;"/><br /><sub>Thiago Lacerda</sub>](https://github.com/thiagogjt)<br />[🐛](https://github.com/formly-js/ng-formly/issues?q=author%3Athiagogjt) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars.githubusercontent.com/u/1104814?v=3" width="100px;"/><br /><sub>danielcrisp</sub>](https://github.com/danielcrisp)<br />[🐛](https://github.com/formly-js/ng-formly/issues?q=author%3Adanielcrisp) [💻](https://github.com/formly-js/ng-formly/commits?author=danielcrisp) | [<img src="https://avatars.githubusercontent.com/u/7455769?v=3" width="100px;"/><br /><sub>Tony Franzese</sub>](https://github.com/franzeal)<br />[🐛](https://github.com/formly-js/ng-formly/issues?q=author%3Afranzeal) [💻](https://github.com/formly-js/ng-formly/commits?author=franzeal) | [<img src="https://avatars.githubusercontent.com/u/1319151?v=3" width="100px;"/><br /><sub>Jackie Gleason</sub>](http://JackieRGleason.com)<br />[🐛](https://github.com/formly-js/ng-formly/issues?q=author%3Ajrgleason) [💻](https://github.com/formly-js/ng-formly/commits?author=jrgleason) | [<img src="https://avatars.githubusercontent.com/u/23452573?v=3" width="100px;"/><br /><sub>ampsarfraz</sub>](https://github.com/ampsarfraz)<br />[🐛](https://github.com/formly-js/ng-formly/issues?q=author%3Aampsarfraz) | [<img src="https://avatars.githubusercontent.com/u/1636728?v=3" width="100px;"/><br /><sub>Krustie101</sub>](https://github.com/Krustie101)<br />[🐛](https://github.com/formly-js/ng-formly/issues?q=author%3AKrustie101) [💻](https://github.com/formly-js/ng-formly/commits?author=Krustie101) | [<img src="https://avatars.githubusercontent.com/u/21162369?v=3" width="100px;"/><br /><sub>ultimafirez</sub>](https://github.com/ultimafirez)<br />[🐛](https://github.com/formly-js/ng-formly/issues?q=author%3Aultimafirez) |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
