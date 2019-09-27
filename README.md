<div align="center">
  <img src="https://raw.githubusercontent.com/formly-js/angular-formly/master/other/logo/angular-formly-logo-64px.png">
  <br />
  JSON powered / Dynamic forms in Angular
  <br /><br />

  [![Npm version](https://badge.fury.io/js/%40ngx-formly%2Fcore.svg)](https://npmjs.org/package/@ngx-formly/core)
  [![Downloads](http://img.shields.io/npm/dm/@ngx-formly/core.svg)](https://npmjs.org/package/@ngx-formly/core)
  [![Gitter](https://badges.gitter.im/formly-js/ng2-formly.svg)](https://gitter.im/formly-js/ng2-formly)
  [![Build Status](https://api.travis-ci.org/ngx-formly/ngx-formly.svg?branch=master)](https://api.travis-ci.org/ngx-formly/ngx-formly.svg?branch=master)
  [![Twitter](https://img.shields.io/badge/twitter-@formlydev-blue.svg)](https://twitter.com/formlydev)
</div>

---

Formly is a dynamic (JSON powered) form library for Angular that bring unmatched maintainability to your application's forms.

## Features

- 🔥 Automatic forms generation
- 📝 Easy to extend with custom field type, validation, wrapper and extension.
- ⚡️ Support multiple schemas:
    - Formly Schema (core)
    - JSON Schema
- 😍 A bunch of themes, out of the box!
- 💪 Build on top of [Angular Reactive Forms](https://angular.io/guide/reactive-forms)
- 😱 Drag and Drop Editor (coming 🔜)

**Supported UI libs**

| UI                                                |                                                              |                                                                   |
| ------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------- |
| [Bootstrap](https://getbootstrap.com)             | [Demo](https://ngx-formly.github.io/ngx-formly/ui/bootstrap) | [StackBlitz](https://stackblitz.com/edit/ngx-formly-ui-bootstrap) |
| [Material2](https://github.com/angular/material2) | [Demo](https://ngx-formly.github.io/ngx-formly/ui/material)  | [StackBlitz](https://stackblitz.com/edit/ngx-formly-ui-material)  |
| [Ionic](https://ionicframework.com)               | [Demo](https://ngx-formly.github.io/ngx-formly/ui/ionic)     | [StackBlitz](https://stackblitz.com/edit/ngx-formly-ui-ionic)     |
| [PrimeNG](http://primefaces.org/primeng/#/)       | [Demo](https://ngx-formly.github.io/ngx-formly/ui/primeng)   | [StackBlitz](https://stackblitz.com/edit/ngx-formly-ui-primeng)   |
| [Kendo](http://www.telerik.com/kendo-angular-ui)  | [Demo](https://ngx-formly.github.io/ngx-formly/ui/kendo)     | [StackBlitz](https://stackblitz.com/edit/ngx-formly-ui-kendo)     |
| [NativeScript](https://www.nativescript.org)      | ||

**Which Version to use?**

| Angular version | Formly version         |
| --------------- | ---------------------- |
| Angular >= 7    | `@ngx-formly/core@5.x` |
| Angular >= 6    | `@ngx-formly/core@4.x` |
| Angular >= 5    | `@ngx-formly/core@3.x` |
| Angular >= 4    | `@ngx-formly/core@2.x` |
| Angular >= 2    | `ng-formly@1.x`        |

#### Quick links
* [Documentation, demos, and guides](https://ngx-formly.github.io/ngx-formly)

## Quick Start

Follow these steps to get started with Ngx Formly. Also check out our [demos](https://ngx-formly.github.io/ngx-formly) for further examples.

#### 1. Install @angular/forms and @ngx-formly/core packages:
```bash
  npm install @angular/forms @ngx-formly/core --save
```

#### 2. Choose and install your UI (pre-defined types/templates) package:

| UI                                                | Npm package name            | NgModule                    |
| ------------------------------------------------- | --------------------------- | --------------------------- |
| [Bootstrap](https://getbootstrap.com)             | `@ngx-formly/bootstrap`     | `FormlyBootstrapModule`     |
| [Material2](https://github.com/angular/material2) | `@ngx-formly/material`      | `FormlyMaterialModule`      |
| [Ionic](https://ionicframework.com)               | `@ngx-formly/ionic`         | `FormlyIonicModule`         |
| [PrimeNG](http://primefaces.org/primeng/#/)       | `@ngx-formly/primeng`       | `FormlyPrimeNGModule`       |
| [Kendo](http://www.telerik.com/kendo-angular-ui)  | `@ngx-formly/kendo`         | `FormlyKendoModule`         |
| [NativeScript](https://www.nativescript.org)      | `@ngx-formly/nativescript`  | `FormlyNativescriptModule`  |

```bash
  npm install @ngx-formly/<package-name> --save
```

#### 3. Import the `FormlyModule` and UI (pre-defined types/templates):

```typescript
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';

/**
 * - Bootstrap:     import {FormlyBootstrapModule} from '@ngx-formly/bootstrap';
 * - Material2:     import {FormlyMaterialModule} from '@ngx-formly/material';
 * - Ionic:         import {FormlyIonicModule} from '@ngx-formly/ionic'
 * - PrimeNG:       import {FormlyPrimeNGModule} from '@ngx-formly/primeng';
 * - Kendo:         import {FormlyKendoModule} from '@ngx-formly/kendo';
 * - NativeScript:  import {FormlyNativescriptModule} from '@ngx-formly/nativescript';
 */
import {FormlyBootstrapModule} from '@ngx-formly/bootstrap';

@NgModule({
  imports: [
    ...,
    ReactiveFormsModule,
    FormlyModule.forRoot(),

    /**
     * - Bootstrap:    FormlyBootstrapModule
     * - Material2:    FormlyMaterialModule
     * - Ionic:        FormlyIonicModule
     * - PrimeNG:      FormlyPrimeNGModule
     * - Kendo:        FormlyKendoModule
     * - NativeScript: FormlyNativescriptModule
     */
    FormlyBootstrapModule,
  ],
})
export class AppModule {}
```

#### 4. Define the form config in your component:

```typescript
import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';

@Component({
  selector: 'app',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit(model)">
      <formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>
      <button type="submit" class="btn btn-default">Submit</button>
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

## Using with Angular-CLI

`@ngx-formly/schematics` provides CLI commands for setting up a project and _eventually_ generating other features (e.g. wrapper components).
Built on top of Schematics, this tool integrates with the Angular CLI.

### Installation

Install `@ngx-formly/schematics` from npm:

`npm install @ngx-formly/schematics --save-dev`

### Default Schematics Collection

To use `@ngx-formly/schematics` as the default collection in your Angular CLI project,
add it to your `angular.json`:

```bash
ng config cli.defaultCollection @ngx-formly/schematics
```

The [collection schema](src/schematics/src/collection.json) defines the available schematics to run.

The `@ngx-formly/schematics` extend the default `@schematics/angular` collection and so all existing Angular CLI commands are available.
If you want to set defaults for schematics such as generating components with scss file, you must change the schematics package name from `@schematics/angular` to `@ngx-formly/schematics` in `angular.json`:

```json
"schematics": {
  "@ngx-formly/schematics:component": {
    "styleext": "scss"
  }
}
```

### Quick Start with Schematics

#### Install @angular/forms and @ngx-formly/core packages and choose a UI theme to install:
```bash
  ng add @ngx-formly/schematics --ui-theme=material
```

## Roadmap

See the [issues labeled enhancement](https://github.com/ngx-formly/ngx-formly/labels/enhancement)

## Credits

* [Abdellatif Ait boudad](https://github.com/aitboudad)
* [Mohammed Zama Khan](https://twitter.com/mohamedzamakhan)
* [Kent C. Dodds](https://twitter.com/kentcdodds)
* [All contributors](https://github.com/ngx-formly/ngx-formly/graphs/contributors)!

## Contributors

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
[<img alt="aitboudad" src="https://avatars2.githubusercontent.com/u/1753742?v=4&s=117" width="117">](https://github.com/aitboudad)[<img alt="mohammedzamakhan" src="https://avatars3.githubusercontent.com/u/2327532?v=4&s=117" width="117">](https://github.com/mohammedzamakhan)[<img alt="divyakumarjain" src="https://avatars2.githubusercontent.com/u/2039134?v=4&s=117" width="117">](https://github.com/divyakumarjain)[<img alt="couzic" src="https://avatars2.githubusercontent.com/u/1380322?v=4&s=117" width="117">](https://github.com/couzic)[<img alt="juristr" src="https://avatars3.githubusercontent.com/u/542458?v=4&s=117" width="117">](https://github.com/juristr)[<img alt="franzeal" src="https://avatars3.githubusercontent.com/u/7455769?v=4&s=117" width="117">](https://github.com/franzeal)

[<img alt="beeman" src="https://avatars3.githubusercontent.com/u/36491?v=4&s=117" width="117">](https://github.com/beeman)[<img alt="klemenoslaj" src="https://avatars2.githubusercontent.com/u/7548247?v=4&s=117" width="117">](https://github.com/klemenoslaj)[<img alt="samtsai" src="https://avatars0.githubusercontent.com/u/225526?v=4&s=117" width="117">](https://github.com/samtsai)[<img alt="thorgod" src="https://avatars3.githubusercontent.com/u/13910170?v=4&s=117" width="117">](https://github.com/thorgod)[<img alt="dwaldrum" src="https://avatars2.githubusercontent.com/u/386721?v=4&s=117" width="117">](https://github.com/dwaldrum)[<img alt="Krustie101" src="https://avatars2.githubusercontent.com/u/1636728?v=4&s=117" width="117">](https://github.com/Krustie101)

[<img alt="MarcosEllys" src="https://avatars3.githubusercontent.com/u/6751242?v=4&s=117" width="117">](https://github.com/MarcosEllys)[<img alt="ryanjerskine" src="https://avatars0.githubusercontent.com/u/5464778?v=4&s=117" width="117">](https://github.com/ryanjerskine)[<img alt="Devqon" src="https://avatars3.githubusercontent.com/u/9316480?v=4&s=117" width="117">](https://github.com/Devqon)[<img alt="AlexTalcura" src="https://avatars2.githubusercontent.com/u/20095773?v=4&s=117" width="117">](https://github.com/AlexTalcura)[<img alt="newsash" src="https://avatars2.githubusercontent.com/u/6377930?v=4&s=117" width="117">](https://github.com/newsash)[<img alt="bhaidar" src="https://avatars0.githubusercontent.com/u/1163421?v=4&s=117" width="117">](https://github.com/bhaidar)

[<img alt="Dayvisson" src="https://avatars1.githubusercontent.com/u/12189515?v=4&s=117" width="117">](https://github.com/Dayvisson)[<img alt="intellix" src="https://avatars3.githubusercontent.com/u/1162531?v=4&s=117" width="117">](https://github.com/intellix)[<img alt="enricouniurb" src="https://avatars1.githubusercontent.com/u/38656571?v=4&s=117" width="117">](https://github.com/enricouniurb)[<img alt="FritzHerbers" src="https://avatars1.githubusercontent.com/u/10029682?v=4&s=117" width="117">](https://github.com/FritzHerbers)[<img alt="jrgleason" src="https://avatars3.githubusercontent.com/u/1319151?v=4&s=117" width="117">](https://github.com/jrgleason)[<img alt="johannesjo" src="https://avatars1.githubusercontent.com/u/1456265?v=4&s=117" width="117">](https://github.com/johannesjo)

[<img alt="jdpnielsen" src="https://avatars3.githubusercontent.com/u/8746698?v=4&s=117" width="117">](https://github.com/jdpnielsen)[<img alt="TheMcMurder" src="https://avatars1.githubusercontent.com/u/3059715?v=4&s=117" width="117">](https://github.com/TheMcMurder)[<img alt="kenisteward" src="https://avatars3.githubusercontent.com/u/12831669?v=4&s=117" width="117">](https://github.com/kenisteward)[<img alt="kentcdodds" src="https://avatars0.githubusercontent.com/u/1500684?v=4&s=117" width="117">](https://github.com/kentcdodds)[<img alt="LennardWesterveld" src="https://avatars2.githubusercontent.com/u/1076589?v=4&s=117" width="117">](https://github.com/LennardWesterveld)[<img alt="LucasJAlba" src="https://avatars3.githubusercontent.com/u/2780076?v=4&s=117" width="117">](https://github.com/LucasJAlba)

[<img alt="lucienbertin" src="https://avatars2.githubusercontent.com/u/10089239?v=4&s=117" width="117">](https://github.com/lucienbertin)[<img alt="waffle-iron" src="https://avatars2.githubusercontent.com/u/6912981?v=4&s=117" width="117">](https://github.com/waffle-iron)[<img alt="mathijshoogland" src="https://avatars2.githubusercontent.com/u/7372934?v=4&s=117" width="117">](https://github.com/mathijshoogland)[<img alt="NanFengCheong" src="https://avatars2.githubusercontent.com/u/7321833?v=4&s=117" width="117">](https://github.com/NanFengCheong)[<img alt="Pouja" src="https://avatars3.githubusercontent.com/u/2385144?v=4&s=117" width="117">](https://github.com/Pouja)[<img alt="Riron" src="https://avatars3.githubusercontent.com/u/5145523?v=4&s=117" width="117">](https://github.com/Riron)

[<img alt="Ronen-dev" src="https://avatars3.githubusercontent.com/u/12510911?v=4&s=117" width="117">](https://github.com/Ronen-dev)[<img alt="blowsie" src="https://avatars2.githubusercontent.com/u/308572?v=4&s=117" width="117">](https://github.com/blowsie)[<img alt="thm1118" src="https://avatars0.githubusercontent.com/u/3632180?v=4&s=117" width="117">](https://github.com/thm1118)[<img alt="Tom-V" src="https://avatars2.githubusercontent.com/u/322654?v=4&s=117" width="117">](https://github.com/Tom-V)[<img alt="danielcrisp" src="https://avatars1.githubusercontent.com/u/1104814?v=4&s=117" width="117">](https://github.com/danielcrisp)[<img alt="francisco-sanchez-molina" src="https://avatars3.githubusercontent.com/u/9049706?v=4&s=117" width="117">](https://github.com/francisco-sanchez-molina)

[<img alt="n3xus" src="https://avatars0.githubusercontent.com/u/510213?v=4&s=117" width="117">](https://github.com/n3xus)
<!-- ALL-CONTRIBUTORS-LIST:END -->
