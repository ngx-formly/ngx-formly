# Upgrade from 10.0 to 11.0

Formly v11 requires Angular 22 or newer and runs in zoneless applications. It continues to use Angular Reactive Forms.
Signal Forms integration is planned for Formly v12 and is not included in v11.
Applications staying on Angular 21 should continue using Formly v10.
If you are upgrading from an earlier release, first follow the
[v10 upgrade guide](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-10.0.md).

## 1. Upgrade Angular and your UI library

Follow the [Angular update guide](https://angular.dev/update-guide?v=21.0-22.0&l=3), including its automated migrations:

```sh
ng update @angular/core@22 @angular/cli@22
```

Angular 22 requires TypeScript 6.0. Check the [Angular compatibility table](https://angular.dev/reference/versions)
for supported Node.js versions. This repository uses Node.js 24.21.0.
Run Angular's migrations before reviewing custom components, since Angular 22 changes the default change-detection
strategy to `OnPush` and aligns template optional chaining with JavaScript's `undefined` result.

Update the UI libraries used by your application:

| Formly package | Required UI library |
| --- | --- |
| `@ngx-formly/bootstrap` | `bootstrap ^5`; applications using `@ng-bootstrap/ng-bootstrap` need v21 for Angular 22 |
| `@ngx-formly/material` | `@angular/material >= 22` |
| `@ngx-formly/primeng` | `primeng >= 22` |
| `@ngx-formly/ng-zorro-antd` | `ng-zorro-antd >= 22` |
| `@ngx-formly/kendo` | Kendo Angular label, dropdown, and input packages >= 25.3.0 |
| `@ngx-formly/nativescript` | `@nativescript/angular >= 22` |
| `@ngx-formly/ionic` | `@ionic/angular ^9` |

Keep related UI packages on compatible versions. Upgrade Angular Material with `ng update @angular/material@22`.
Use Kendo theme v14.6.1 with Kendo Angular v25.3.0. The Kendo inputs and dropdowns gained zoneless support in v25.1;
see the [Kendo changelog](https://www.telerik.com/kendo-angular-ui/components/changelogs/kendo-angular-ui).

### Review copied UI templates and custom styles

Formly's Ionic adapter now imports individual standalone Ionic 9 components. Upgrade `@ionic/angular` to v9 and
replace `importProvidersFrom(IonicModule.forRoot())` with `provideIonicAngular()` from `@ionic/angular` in your
application providers. Import the individual Ionic components used by custom field templates in their component
or NgModule `imports`. Formly's `FormlyIonicModule` and `provideFormlyCore(withFormlyIonic())` APIs remain supported.
See the [Ionic 9 migration guide](https://ionicframework.com/docs/updating/9-0) for other application changes.

PrimeNG 22 uses `p-radiobutton` in place of `p-radioButton`. Update copied radio templates and DOM selectors.
Formly's select and datepicker `props.appendTo` now use PrimeNG's `AppendTo` type. Use `'body'`, `'self'`, or a supported
element or template reference instead of an arbitrary string.

NG-ZORRO 22 datepickers require an explicit date adapter. If your application uses one, add
`provideNzDateFnsAdapter()` from `ng-zorro-antd/core/time` to its providers to retain the previous date-fns behavior.
The NG-ZORRO gallery configuration includes this provider for exported examples.

Kendo 25 changes the CSS classes on native checkbox, input, and textarea directives. Review custom styles and DOM
tests that depend on classes such as `k-input-md`, `k-rounded-md`, or `k-input-solid` being present by default.

## 2. Update all Formly packages together

Update `@ngx-formly/core` and every `@ngx-formly/*` UI package used by your application to v11 in the same installation.
For an application using Angular Material:

```sh
npm install @ngx-formly/core@11 @ngx-formly/material@11
```

Replace `@ngx-formly/material` with your UI package, or include each UI package if your application uses several.
Keep your existing `FormGroup`, `FormlyFieldConfig`, validators, and model bindings. The standalone and NgModule APIs
remain supported. No Signal Forms migration is required for v11.

## 3. Run without Zone.js

The demo, exported StackBlitz examples, and SSR application now use Angular's default zoneless change detection.
To migrate your application, remove `provideZoneChangeDetection()` from its providers and remove `zone.js` from
its application polyfills. Remove `zone.js/testing` too if your tests no longer use Zone.js.
You can uninstall `zone.js` once neither your application nor its tests require it.

Existing applications can retain Zone.js and `provideZoneChangeDetection()` while migrating.
The library supports both change-detection modes. The repository retains Zone.js as a development dependency
for its existing unit tests and compatibility coverage.

### Notify Angular after asynchronous updates

When an HTTP subscription updates a component's `fields` or `model`, call `ChangeDetectorRef.markForCheck()` after
assigning those properties, or expose the data through signals or the async pipe. The JSON Schema and JSON powered
examples demonstrate this notification.

Angular Reactive Forms methods such as `patchValue()` do not themselves schedule a render. For template bindings
to form state outside Formly, subscribe through the async pipe or call `markForCheck()` when the relevant form
observable emits. Formly observes its controls to refresh field state and validation messages.

Custom fields must also notify Angular when asynchronous callbacks update template state.
Replace waits on `NgZone.onStable` or `NgZone.onMicrotaskEmpty`, which do not emit in zoneless applications.
See [Angular's zoneless guide](https://angular.dev/guide/zoneless) for render hooks and SSR pending tasks.

## 4. Review numeric step validation

An explicitly configured positive `props.step` now validates numeric values in Angular's form model.
For example, `step: 0.01` rejects `123.456` with a `step` error. Add a validation message named `step`.
The increment starts at `props.min` when supplied, otherwise zero.

If the increment is only a UI preference and arbitrary numeric values must remain valid, set `props.step` to
`'any'` and put the UI increment in `props.attributes.step`. Numeric fields without `props.step` retain their
existing validation behavior. JSON Schema fields retain their separate `multipleOf` validation.

## 5. Review independent alternate editors

`shareFormControl: false` is now public for mutually exclusive fields at the same model path. If you used this
previously internal option, hidden editors no longer run parsers or write detached control values into the model.
Hiding cancels pending debounced model writes. Update the model directly when changing an inactive value; the
editor reads that value and applies its parser when shown again.

Set `resetOnHide: false` on every alternative to retain values when switching. The default remains `true`.
Keep at most one independent editor visible at a model path. See the
[alternate editor documentation](docs/properties-options.md#alternate-editors-for-the-same-model-value).

## 6. Verify the upgrade

Build your application and run its tests. Check asynchronously loaded fields, async validation, expression-driven
visibility, disabled states, reset behavior, and each UI integration you use. In zoneless component tests, await
`fixture.whenStable()` so the test verifies Angular's scheduled rendering.

For SSR applications, check the server-rendered form and then interact with it after hydration. Async work needed
for server rendering must be tracked through Angular's `PendingTasks` or an API that already tracks it, such as
`HttpClient`.
