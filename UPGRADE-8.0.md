# Upgrade from 7.0 to 8.0

Formly v8 requires Angular 19 or newer. Applications staying on Angular 18 should continue using Formly v7.

## 1. Upgrade Angular and your UI library

Follow the [Angular update guide](https://angular.dev/update-guide?v=18.0-19.0&l=1) before upgrading Formly.
For an Angular 18 application, start with:

```sh
ng update @angular/core@19 @angular/cli@19
```

The following Formly integrations also raise their minimum UI library version:

| Formly package              | Required UI library       |
| --------------------------- | ------------------------- |
| `@ngx-formly/material`      | `@angular/material >= 19` |
| `@ngx-formly/primeng`       | `primeng >= 19`           |
| `@ngx-formly/ng-zorro-antd` | `ng-zorro-antd >= 19`     |

Upgrade the UI library used by your application and follow its migration instructions. For Angular Material:

```sh
ng update @angular/material@19
```

For PrimeNG, review the [migration guide](https://v19.primeng.org/guides/migration), including theme configuration
if your application still imports styles from `primeng/resources`.

## 2. Update all Formly packages together

Update `@ngx-formly/core` and every `@ngx-formly/*` UI package used by your application to v8 in the same installation.
For example, an application using Angular Material should run:

```sh
npm install @ngx-formly/core@8 @ngx-formly/material@8
```

Replace `@ngx-formly/material` with your UI package, or include each UI package if your application uses several.
Both the standalone and NgModule APIs remain supported.

## 3. Review configuration in child injection scopes

`provideFormlyCore()` now provides a separate `FormlyConfig` instance in the injector where it is registered.
Calling it in a child component or route creates an independent configuration instead of extending the parent's
configuration. Register the types, wrappers, and validation messages needed by that independent configuration.

To extend the shared configuration in a child scope, use `provideFormlyConfig()` instead:

```diff
- import { provideFormlyCore } from '@ngx-formly/core';
+ import { provideFormlyConfig } from '@ngx-formly/core';

  providers: [
-   provideFormlyCore({
+   provideFormlyConfig({
      validationMessages: [{ name: 'required', message: 'This field is required' }],
    }),
  ],
```

Keep `provideFormlyCore()` at the application root. In NgModule applications, use `FormlyModule.forRoot()` at the
root and `FormlyModule.forChild()` to add configuration in feature modules using the inherited configuration service.

## 4. Review custom PrimeNG textarea integrations

The built-in Formly textarea now uses PrimeNG's `pTextarea` directive from `primeng/textarea`.
The Formly field type remains `textarea`, so existing field configurations do not need to change for this update.

If you maintain a custom textarea component based on the previous implementation, update its PrimeNG import and directive:

```diff
- import { InputTextareaModule } from 'primeng/inputtextarea';
+ import { TextareaModule } from 'primeng/textarea';

- <textarea pInputTextarea [formControl]="formControl" [formlyAttributes]="field"></textarea>
+ <textarea pTextarea [formControl]="formControl" [formlyAttributes]="field"></textarea>
```

Replace `InputTextareaModule` with `TextareaModule` in the component or NgModule `imports` array too.
Review custom styles and tests that target the old directive or its rendered classes.
See the [PrimeNG textarea documentation](https://v19.primeng.org/textarea) for the current API.

## 5. Verify the upgrade

Build your application and run its tests. Check custom field types, validation messages, and forms configured in
child components or lazy-loaded routes, especially where `provideFormlyCore()` was previously called more than once.

See the [v8 changelog](https://github.com/ngx-formly/ngx-formly/blob/main/CHANGELOG.md#800-2026-09-08) for the full list of changes.
