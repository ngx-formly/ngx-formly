# Upgrade from 8.0 to 9.0

Formly v9 requires Angular 20 or newer. Applications staying on Angular 19 should continue using Formly v8.
If you are upgrading from Formly v7 or earlier, first follow the
[v8 upgrade guide](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-8.0.md).

## 1. Upgrade Angular and your UI library

Follow the [Angular update guide](https://angular.dev/update-guide?v=19.0-20.0&l=1) before upgrading Formly.
For an Angular 19 application, start with:

```sh
ng update @angular/core@20 @angular/cli@20
```

Check Angular's [version compatibility table](https://angular.dev/reference/versions) for the Node.js and TypeScript
versions supported by your Angular minor version. Angular 20 does not support TypeScript 6.

The following Formly integrations raise their minimum UI library versions:

| Formly package              | Required UI library                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `@ngx-formly/material`      | `@angular/material >= 20`                                                                                          |
| `@ngx-formly/primeng`       | `primeng >= 20`                                                                                                    |
| `@ngx-formly/ng-zorro-antd` | `ng-zorro-antd >= 20`                                                                                              |
| `@ngx-formly/kendo`         | `@progress/kendo-angular-label`, `@progress/kendo-angular-dropdowns`, and `@progress/kendo-angular-inputs >= 19.1` |
| `@ngx-formly/nativescript`  | `@nativescript/angular >= 20`                                                                                      |

Upgrade the UI libraries used by your application and follow their migration instructions. Keep related packages,
such as Angular Material and CDK or the Kendo Angular packages, on mutually compatible versions. For Angular Material:

```sh
ng update @angular/material@20
```

## 2. Update all Formly packages together

Update `@ngx-formly/core` and every `@ngx-formly/*` UI package used by your application to v9 in the same installation.
For example, an application using Angular Material should run:

```sh
npm install @ngx-formly/core@9 @ngx-formly/material@9
```

Replace `@ngx-formly/material` with your UI package, or include each UI package if your application uses several.
Both the standalone and NgModule APIs remain supported.

## 3. Update PrimeNG datepicker fields and themes

### Removed datepicker options

PrimeNG 20 removed `monthNavigator`, `yearNavigator`, and `yearRange`. Remove these properties from the `props`
of Formly datepicker fields, including any shared default options or custom types that set them:

```diff
  {
    key: 'date',
    type: 'datepicker',
    props: {
      label: 'Date',
      dateFormat: 'yy-mm-dd',
-     monthNavigator: true,
-     yearNavigator: true,
-     yearRange: '2020:2030',
    },
  }
```

These options were obsolete in PrimeNG and have no replacement inputs.
See the [PrimeNG v20 migration guide](https://primeng.org/migration/v20) for the complete list of removed APIs.

### Theme package

Replace the deprecated `@primeng/themes` dependency with `@primeuix/themes` and update theme imports:

```diff
- import Aura from '@primeng/themes/aura';
+ import Aura from '@primeuix/themes/aura';
```

If you use helpers such as `definePreset`, update those imports to `@primeuix/themes` too.
Continue registering the theme through `providePrimeNG`:

```ts
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

providePrimeNG({ theme: { preset: Aura } });
```

The theme-package change is backward compatible in PrimeNG 20; switching packages avoids relying on the deprecated
`@primeng/themes` entry point. See the [PrimeUIX migration notes](https://primeng.org/migration/v20#primeuix-themes).

## 4. Review custom NG-ZORRO numeric inputs

Formly's built-in numeric input uses `NzInputNumberLegacyModule` from `ng-zorro-antd/input-number-legacy` with
NG-ZORRO 20. Existing Formly fields using `type: 'input'` and `props.type: 'number'` keep the same configuration.

If you copied the Formly numeric-input implementation into a custom field and want to keep its existing API,
update the module import:

```diff
- import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
+ import { NzInputNumberLegacyModule } from 'ng-zorro-antd/input-number-legacy';
```

Replace `NzInputNumberModule` with `NzInputNumberLegacyModule` in that custom component or NgModule's `imports` array too.
Applications using only the built-in Formly type do not need to add this import themselves.

## 5. Review custom styles and DOM selectors

PrimeNG datepicker and select controls, Kendo numeric inputs, and NG-ZORRO numeric inputs now associate the Formly
field ID with their focusable input. Their outer component uses the field ID followed by `-container`.
Update custom styles and tests that expected the original field ID on the outer component.

PrimeNG text inputs, textareas, datepickers, and selects now fill their available width. Review custom sizing rules
if your application relied on their previous intrinsic width.

## 6. Verify the upgrade

Build your application and run its tests. Check date selection, themes, numeric inputs, labels, disabled states,
and validation messages in each UI integration you use. PrimeNG and Kendo select fields support `props.multiple`;
use an array model value when it is enabled and check both single- and multiple-selection forms.

For server-rendered applications, also verify that forms hydrate and accept input after the page loads.
