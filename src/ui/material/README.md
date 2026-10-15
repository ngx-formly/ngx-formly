# @ngx-formly/material

Angular Material field types and wrappers for Formly. This adapter uses Material controls and `mat-form-field` for labels, hints, and validation messages.

## Installation

For Formly 11, use Angular 22 or newer and Angular Material 22 or newer. Keep all `@ngx-formly/*` packages on the same version, and use an `@angular/forms` version matching your application.

In an Angular application with Reactive Forms installed:

```sh
npm install @ngx-formly/core@^11 @ngx-formly/material@^11 @angular/material@^22 @angular/cdk@^22
```

Configure an Angular Material theme in your application. For example, add `node_modules/@angular/material/prebuilt-themes/azure-blue.css` to the build target's `styles` array in `angular.json`. See the [Material setup guide](https://material.angular.dev/guide/getting-started) for application setup.

## Configuration

Add the adapter to your application providers in `app.config.ts`:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';

export const appConfig: ApplicationConfig = {
  providers: [provideFormlyCore(withFormlyMaterial())],
};
```

## Usage

This field renders an email input using Angular Material:

```ts
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';

@Component({
  selector: 'app-example',
  imports: [ReactiveFormsModule, FormlyForm],
  template: `
    <form [formGroup]="form">
      <formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>
    </form>
  `,
})
export class ExampleComponent {
  form = new FormGroup({});
  model = { email: '' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      props: { type: 'email', label: 'Email', required: true },
    },
  ];
}
```

## Field types

`withFormlyMaterial()` registers `input`, `textarea`, `checkbox`, `multicheckbox`, `radio`, and `select`, together with their form-field wrapper.

Register these additional controls separately:

| Field type      | Import                               | Registration                    |
| --------------- | ------------------------------------ | ------------------------------- |
| `datepicker`    | `@ngx-formly/material/datepicker`    | `withFormlyFieldDatepicker()`   |
| `native-select` | `@ngx-formly/material/native-select` | `withFormlyFieldNativeSelect()` |
| `slider`        | `@ngx-formly/material/slider`        | `withFormlyFieldSlider()`       |
| `toggle`        | `@ngx-formly/material/toggle`        | `withFormlyFieldToggle()`       |

For a datepicker with JavaScript `Date` values, use this application configuration:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { withFormlyFieldDatepicker } from '@ngx-formly/material/datepicker';

export const appConfig: ApplicationConfig = {
  providers: [provideNativeDateAdapter(), provideFormlyCore([...withFormlyMaterial(), withFormlyFieldDatepicker()])],
};
```

## Which Version to use?

Match `@ngx-formly/material` to your `@ngx-formly/core` version, and check the migration guide for UI library requirements.

| Angular version | Formly version       | Migration                          |
| --------------- | -------------------- | ---------------------------------- |
| Angular >= 22   | `@ngx-formly/material@11.x` | [Upgrade to v11](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-11.0.md)    |
| Angular >= 21   | `@ngx-formly/material@10.x` | [Upgrade to v10](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-10.0.md)    |
| Angular >= 20   | `@ngx-formly/material@9.x` | [Upgrade to v9](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-9.0.md)      |
| Angular >= 19   | `@ngx-formly/material@8.x` | [Upgrade to v8](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-8.0.md)      |
| Angular >= 18   | `@ngx-formly/material@7.x` | [Upgrade to v7](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-7.0.md)      |
| Angular >= 13   | `@ngx-formly/material@6.x` | [Upgrade to v6](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-6.0.md)      |
| Angular >= 7    | `@ngx-formly/material@5.x` | [Upgrade to v5](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-5.0.md)      |
| Angular >= 6    | `@ngx-formly/material@4.x` |                                    |
| Angular >= 5    | `@ngx-formly/material@3.x` |                                    |
| Angular >= 4    | `@ngx-formly/material@2.x` | [Upgrade to v2](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-2.0.md)      |

## Documentation

- [Angular Material examples](https://formly.dev/ui/material)
- [Formly guide](https://formly.dev/guide)
- [Source](https://github.com/ngx-formly/ngx-formly/tree/main/src/ui/material)
