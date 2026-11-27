# @ngx-formly/optimus-ui

Optimus UI fields for Angular Reactive Forms. The adapter supports text and number inputs, textareas, checkboxes, radio buttons, single and multiple selects, and a datepicker.

## Installation

Use Formly 11, Angular 22.2.1 or later in the 22.x line, and Optimus UI 2.1 or later in the 2.x line. Match the versions of your `@ngx-formly/*` packages.

```sh
npm install @ngx-formly/core@^11 @ngx-formly/optimus-ui@^11 @openng/optimus-ui@^2.1.0 @openng/optimus-ui-themes@^2.1.0
```

In `app.config.ts`, register the fields and choose a theme preset. This example uses Aura.

```ts
import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyOptimusUI } from '@ngx-formly/optimus-ui';
import { provideOptimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [provideOptimus({ theme: { preset: Aura } }), provideFormlyCore(withFormlyOptimusUI())],
};
```

For an NgModule application, import `FormlyModule.forRoot()` and `FormlyOptimusUIModule`, and add `provideOptimus(...)` to the root providers.

## Field types

`withFormlyOptimusUI()` registers `input`, `textarea`, `checkbox`, `radio`, and `select` with the `form-field` wrapper. The JSON Schema aliases are `string`, `number`, `integer`, `boolean`, and `enum`. Set `props.multiple` on a select to bind an array.

Register the optional datepicker when you use `type: 'datepicker'`.

```ts
import { withFormlyFieldDatepicker } from '@ngx-formly/optimus-ui/datepicker';

provideFormlyCore([...withFormlyOptimusUI(), withFormlyFieldDatepicker()]);
```

NgModule applications can import `FormlyDatepickerModule` from the same entry point. [Try the field examples](https://formly.dev/ui/optimus-ui).

## Migrate from PrimeNG

Formly has deprecated `@ngx-formly/primeng`. To migrate an Angular 22 application:

1. In `package.json`, replace `@ngx-formly/primeng` with `@ngx-formly/optimus-ui`. Update all `@ngx-formly/*` packages together to a v11 release that includes the adapter. Replace `primeng` with `@openng/optimus-ui@^2.1.0` and any `@primeuix/themes` dependency with `@openng/optimus-ui-themes@^2.1.0`. Remove the `overrides.primeng` entry and run `npm install`.
2. Change imports from `@ngx-formly/primeng` to `@ngx-formly/optimus-ui`, including subpaths such as `/datepicker`. Replace `withFormlyPrimeNG()` with `withFormlyOptimusUI()`, or `FormlyPrimeNGModule` with `FormlyOptimusUIModule`.
3. Replace `providePrimeNG` with `provideOptimus` and update the theme import as shown above. In custom components, change `primeng/...` imports to `@openng/optimus-ui/...`. Update any custom CSS or tests targeting Formly elements from `formly-field-primeng-*` and `formly-wrapper-primeng-*` to their `optimus-ui` equivalents.

Existing built-in field names, model keys, and datepicker registrations carry over. For other PrimeNG package and asset renames, consult the [upstream migration guide](https://v1.optimus.openng.org/migration/primeng).
