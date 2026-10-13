# Upgrade from 9.0 to 10.0

Formly v10 requires Angular 21 or newer. Applications staying on Angular 20 should continue using Formly v9.
If you are upgrading from Formly v8 or earlier, first follow the
[v9 upgrade guide](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-9.0.md).

## Breaking changes

Check the changes that apply to your application, including those introduced by the required dependency upgrades.

| Breaking change | Migration |
| --- | --- |
| Formly v10 requires Angular 21 or newer and compatible UI library versions. | [Upgrade Angular and UI libraries](#1-upgrade-angular-and-your-ui-library), then [update all Formly packages together](#2-update-all-formly-packages-together). |
| Angular 21 uses zoneless change detection by default. Applications relying on Zone.js must opt in explicitly. | [Keep Zone.js change detection](#zonejs-applications). |
| PrimeNG 21 requires updated themes and no longer uses `showTransitionOptions` or `hideTransitionOptions` for animations. | [Update PrimeNG themes and animations](#3-update-primeng-themes-and-animations). |
| NG-ZORRO 21 removes the legacy numeric-input module, and Formly removes `FormlyFieldInput.nzFormatter`. | [Update custom NG-ZORRO numeric inputs](#4-review-custom-ng-zorro-numeric-inputs). |
| The CSP parser rejects trailing tokens it previously ignored, which can prevent form construction. | [Correct CSP string expressions](#5-review-csp-string-expressions). |
| Cleared nullable JSON Schema numeric fields now retain explicit `null` values. | [Handle nullable numeric values](#nullable-numeric-values). |
| Valid forms now emit an initial `form.statusChanges` notification. | [Review initial status notifications](#initial-status-notifications). |
| Applications using Angular's `CommonEngine` need allowed hostnames configured to retain server rendering. | [Configure server rendering](#server-rendering). |

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

### Zone.js applications

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

Formly's numeric input now uses NG-ZORRO's default formatter and no longer exposes `FormlyFieldInput.nzFormatter`.
Custom templates that referenced this helper should remove the `[nzFormatter]="nzFormatter"` binding.

If you copied the previous Formly numeric-input implementation into a custom field, update the module import:

```diff
- import { NzInputNumberLegacyModule } from 'ng-zorro-antd/input-number-legacy';
+ import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
```

Replace `NzInputNumberLegacyModule` with `NzInputNumberModule` in that custom component or NgModule's `imports` array too.
Applications using only the built-in Formly type do not need to add this import themselves.

## 5. Review CSP string expressions

If you enable `withFormlyFieldExpression()`, the parser now requires the entire string expression to be valid.
Trailing tokens that were previously ignored now cause a parse error and may prevent the form from building.

Review string values in `expressions`, `expressionProperties`, and `hideExpression`.
For example, `model.enabled false` previously evaluated only `model.enabled`; it now fails parsing.
Remove unintended trailing tokens or correct the expression, such as `model.enabled === false` if that is the intended condition.
Method calls remain unsupported. See the [expression evaluation guide](docs/expression-properties.md#4-expression-evaluation)
for supported optional property and index access.

## 6. Verify the upgrade

### Nullable numeric values

JSON Schema fields that allow both a numeric type and `null` now preserve `null` when cleared.
If your application treated a missing property as a cleared nullable number, handle explicit `null` values too.

### Initial status notifications

Formly now emits an initial `form.statusChanges` notification for valid forms too. Subscribers may therefore
run once during initialization even when the status stays `VALID`. Unchanged rebuilds do not repeat that notification.
Initial validation expressions may cause a corrective notification after an earlier status.
Update subscribers and tests that assumed valid forms would not emit an initial notification.

### Field build notifications

The new `fieldChange` output delivers build notifications asynchronously after the current change-detection pass.
When replacing a synchronous form-ready workaround, move control subscriptions into the `fieldChange` handler.
In component tests, await `fixture.whenStable()` before checking the notification or the UI it updates.
See [form build notifications](docs/properties-options.md#accessing-controls-after-a-build).

### UI integrations

Build your application and run its tests. Check date selection, themes, numeric inputs, labels, disabled states,
and validation messages in each UI integration you use. Check both single- and multiple-selection forms.

### Server rendering

For server-rendered applications, verify that forms hydrate and accept input after the page loads.
If you use Angular's `CommonEngine`, configure `allowedHosts` with your application's hostnames.
The integration test server allows `localhost` and `127.0.0.1`; a deployed server needs its own hostnames.
