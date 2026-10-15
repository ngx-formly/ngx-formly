# @ngx-formly/schematics

Angular CLI schematics for adding Formly to an NgModule application. The `ng-add` schematic installs Formly dependencies and adds the Formly and Reactive Forms imports to the application module.

Formly 11 targets Angular 22 or newer. For a standalone application, configure Formly manually using the [core package instructions](https://www.npmjs.com/package/@ngx-formly/core) and your UI adapter's README. This schematic expects an NgModule to update.

## Usage

Run this in your Angular workspace:

```sh
ng add @ngx-formly/schematics@^11 --ui-theme=bootstrap
```

Replace `bootstrap` with `material`, `ionic`, `primeng`, `kendo`, `ng-zorro-antd`, or `nativescript`. Omit `--ui-theme` if you plan to register your own field types.

For a workspace with multiple projects, specify the target:

```sh
ng add @ngx-formly/schematics@^11 --project=my-app --ui-theme=material
```

## What it changes

- Adds `@angular/forms` and `@ngx-formly/core` to `package.json` and schedules dependency installation.
- Imports `ReactiveFormsModule` and `FormlyModule.forRoot()` into the application module.
- When `--ui-theme` is set, adds the matching `@ngx-formly/<theme>` dependency and imports its Formly module.

Complete the UI library's setup, including its dependencies, global styles, and providers. The schematic does not configure those or create a form component.

## UI setup guides

| Theme           | Package instructions                                                                 |
| --------------- | ------------------------------------------------------------------------------------ |
| `bootstrap`     | [@ngx-formly/bootstrap](https://www.npmjs.com/package/@ngx-formly/bootstrap)         |
| `material`      | [@ngx-formly/material](https://www.npmjs.com/package/@ngx-formly/material)           |
| `ionic`         | [@ngx-formly/ionic](https://www.npmjs.com/package/@ngx-formly/ionic)                 |
| `primeng`       | [@ngx-formly/primeng](https://www.npmjs.com/package/@ngx-formly/primeng)             |
| `kendo`         | [@ngx-formly/kendo](https://www.npmjs.com/package/@ngx-formly/kendo)                 |
| `ng-zorro-antd` | [@ngx-formly/ng-zorro-antd](https://www.npmjs.com/package/@ngx-formly/ng-zorro-antd) |
| `nativescript`  | [@ngx-formly/nativescript](https://www.npmjs.com/package/@ngx-formly/nativescript)   |

## Documentation

- [Formly guide](https://formly.dev/guide)
- [Upgrade to Formly 11](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-11.0.md)
- [Source](https://github.com/ngx-formly/ngx-formly/tree/main/src/schematics)
