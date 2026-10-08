# Upgrade from 9.0 to 10.0

Formly v10 requires Angular 21 or newer. Applications staying on Angular 20 should continue using Formly v9.
If you are upgrading from Formly v8 or earlier, first follow the
[v9 upgrade guide](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-9.0.md).

## 1. Upgrade Angular and your UI library

Follow the [Angular update guide](https://angular.dev/update-guide?v=20.0-21.0&l=1) before upgrading Formly.
For an Angular 20 application, run:

```sh
ng update @angular/core@21 @angular/cli@21
```

Check Angular's [version compatibility table](https://angular.dev/reference/versions) for supported Node.js versions.
Angular 21 requires TypeScript 5.9 and does not support TypeScript 6.

Use these UI library versions with Angular 21:

| Formly package | Required UI library |
| --- | --- |
| `@ngx-formly/bootstrap` | `bootstrap ^5`; applications using `@ng-bootstrap/ng-bootstrap` also need v20 for Angular 21 |
| `@ngx-formly/material` | `@angular/material >= 21` |
| `@ngx-formly/primeng` | `primeng >= 21`, with `@primeuix/themes >= 2.0.2` when using styled mode |
| `@ngx-formly/ng-zorro-antd` | `ng-zorro-antd >= 21` |
| `@ngx-formly/kendo` | `@progress/kendo-angular-label`, `@progress/kendo-angular-dropdowns`, and `@progress/kendo-angular-inputs >= 21.4.1` |
| `@ngx-formly/nativescript` | `@nativescript/angular >= 21` |
| `@ngx-formly/ionic` | `@ionic/angular ^8` |

Keep related packages, such as Angular Material and CDK or the Kendo Angular packages, on mutually compatible versions.
For Angular Material, run:

```sh
ng update @angular/material@21
```

Use Kendo theme v12.3 with Kendo Angular v21.4.1, as listed in the
[Kendo changelog](https://www.telerik.com/kendo-angular-ui/components/changelogs/kendo-angular-ui#v2141).

Angular 21 uses zoneless change detection by default. Existing applications that rely on Zone.js should keep
`zone.js` in their polyfills and register `provideZoneChangeDetection()` in their application providers.
The demo and exported examples retain Zone.js change detection.

## 2. Update all Formly packages together

Update `@ngx-formly/core` and every `@ngx-formly/*` UI package used by your application to v10 in the same installation.
For example, an application using Angular Material should run:

```sh
npm install @ngx-formly/core@10 @ngx-formly/material@10
```

Replace `@ngx-formly/material` with your UI package, or include each UI package if your application uses several.
Both the standalone and NgModule APIs remain supported.

## 3. Update PrimeNG themes and animations

Use `@primeuix/themes` v2.0.2 or newer with PrimeNG 21. Existing imports from `@primeuix/themes` remain valid.
PrimeNG 21 uses native CSS animations; `showTransitionOptions` and `hideTransitionOptions` no longer control its animations.
See the [PrimeNG v21 migration guide](https://primeng.org/migration/v21).

## 4. Review custom NG-ZORRO numeric inputs

NG-ZORRO 21 removed `ng-zorro-antd/input-number-legacy`. Formly's built-in numeric input now uses
`NzInputNumberModule` from `ng-zorro-antd/input-number`. Existing Formly fields using `type: 'input'` and
`props.type: 'number'` keep the same configuration.

If you copied the previous Formly numeric-input implementation into a custom field, update the module import:

```diff
- import { NzInputNumberLegacyModule } from 'ng-zorro-antd/input-number-legacy';
+ import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
```

Replace `NzInputNumberLegacyModule` with `NzInputNumberModule` in that custom component or NgModule's `imports` array too.
Applications using only the built-in Formly type do not need to add this import themselves.

## 5. Verify the upgrade

Build your application and run its tests. Check date selection, themes, numeric inputs, labels, disabled states,
and validation messages in each UI integration you use. Check both single- and multiple-selection forms.

For server-rendered applications, verify that forms hydrate and accept input after the page loads.
If you use Angular's `CommonEngine`, configure `allowedHosts` with your application's hostnames.
The integration test server allows `localhost` and `127.0.0.1`; a deployed server needs its own hostnames.
