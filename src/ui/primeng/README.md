# @ngx-formly/primeng

PrimeNG field types and wrappers for Formly. This adapter connects PrimeNG inputs, selection controls, and validation messages to Angular Reactive Forms.

## Installation

For Formly 11, use Angular 22 and PrimeNG 21.1.10. Keep all `@ngx-formly/*` packages on the same version, and use an `@angular/forms` version matching your application.

PrimeNG 21 declares Angular 21 peer dependencies. To use it with Angular 22, add these scoped npm overrides to your application's `package.json` before installing. Each referenced Angular package must be a direct dependency of the application:

```json
{
  "overrides": {
    "primeng": {
      "@angular/cdk": "$@angular/cdk",
      "@angular/common": "$@angular/common",
      "@angular/core": "$@angular/core",
      "@angular/forms": "$@angular/forms",
      "@angular/platform-browser": "$@angular/platform-browser",
      "@angular/router": "$@angular/router"
    }
  }
}
```

In an Angular application with Reactive Forms installed:

```sh
npm install @ngx-formly/core@^11 @ngx-formly/primeng@^11 primeng@^21.1.10 @primeuix/themes@^2.0.2 @angular/cdk@^22
```

The example below configures the Aura theme. Keep your existing `providePrimeNG()` configuration if the application already has one. See the [PrimeNG 21 installation guide](https://v21.primeng.org/installation) for the UI library's application setup requirements.

## Configuration

Add the adapter to your application providers in `app.config.ts`:

```ts
import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyPrimeNG } from '@ngx-formly/primeng';

export const appConfig: ApplicationConfig = {
  providers: [providePrimeNG({ theme: { preset: Aura } }), provideFormlyCore(withFormlyPrimeNG())],
};
```

## Usage

This field renders an email input using PrimeNG:

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

`withFormlyPrimeNG()` registers `input`, `textarea`, `checkbox`, `radio`, and `select`, together with their form-field wrapper.

The `datepicker` type is available separately from `@ngx-formly/primeng/datepicker`. Import `withFormlyFieldDatepicker` from that entry point and replace the Formly provider above with:

```ts
provideFormlyCore([...withFormlyPrimeNG(), withFormlyFieldDatepicker()]);
```

Individual registrations are also available from entry points such as `@ngx-formly/primeng/input` and `@ngx-formly/primeng/select`.

## Which Version to use?

Match `@ngx-formly/primeng` to your `@ngx-formly/core` version, and check the migration guide for UI library requirements.

| Angular version | Formly version       | Migration                          |
| --------------- | -------------------- | ---------------------------------- |
| Angular >= 22   | `@ngx-formly/primeng@11.x` | [Upgrade to v11](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-11.0.md)    |
| Angular >= 21   | `@ngx-formly/primeng@10.x` | [Upgrade to v10](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-10.0.md)    |
| Angular >= 20   | `@ngx-formly/primeng@9.x` | [Upgrade to v9](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-9.0.md)      |
| Angular >= 19   | `@ngx-formly/primeng@8.x` | [Upgrade to v8](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-8.0.md)      |
| Angular >= 18   | `@ngx-formly/primeng@7.x` | [Upgrade to v7](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-7.0.md)      |
| Angular >= 13   | `@ngx-formly/primeng@6.x` | [Upgrade to v6](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-6.0.md)      |
| Angular >= 7    | `@ngx-formly/primeng@5.x` | [Upgrade to v5](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-5.0.md)      |
| Angular >= 6    | `@ngx-formly/primeng@4.x` |                                    |
| Angular >= 5    | `@ngx-formly/primeng@3.x` |                                    |
| Angular >= 4    | `@ngx-formly/primeng@2.x` | [Upgrade to v2](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-2.0.md)      |

## Documentation

- [PrimeNG examples](https://formly.dev/ui/primeng)
- [Formly guide](https://formly.dev/guide)
- [Source](https://github.com/ngx-formly/ngx-formly/tree/main/src/ui/primeng)
