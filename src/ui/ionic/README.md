# @ngx-formly/ionic

Ionic field types and wrappers for Formly. This adapter uses Ionic standalone controls such as `ion-input`, `ion-select`, and `ion-checkbox` with Angular Reactive Forms.

## Installation

For Formly 11, use Angular 22 or newer and Ionic 9. Keep all `@ngx-formly/*` packages on the same version, and use an `@angular/forms` version matching your application.

In an Angular application with Reactive Forms installed:

```sh
npm install @ngx-formly/core@^11 @ngx-formly/ionic@^11 @ionic/angular@^9
```

Use this adapter in an Ionic Angular application with its global Ionic styles configured. For an existing Angular application, follow the [Ionic Angular setup guide](https://ionicframework.com/docs/angular/overview). Initialize Ionic with `provideIonicAngular()` as shown below.

## Configuration

Add the adapter to your application providers in `app.config.ts`:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyIonic } from '@ngx-formly/ionic';

export const appConfig: ApplicationConfig = {
  providers: [provideIonicAngular(), provideFormlyCore(withFormlyIonic())],
};
```

## Usage

This field renders an email input using Ionic:

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

`withFormlyIonic()` registers `input`, `textarea`, `checkbox`, `radio`, and `select`, together with their form-field wrapper.

Register these additional controls separately:

| Field type        | Import                       | Registration                |
| ----------------- | ---------------------------- | --------------------------- |
| `datetime`        | `@ngx-formly/ionic/datetime` | `withFormlyFieldDatetime()` |
| `slider`, `range` | `@ngx-formly/ionic/slider`   | `withFormlyFieldSlider()`   |
| `toggle`          | `@ngx-formly/ionic/toggle`   | `withFormlyFieldToggle()`   |

For example, add `withFormlyFieldToggle()` alongside the default types:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyIonic } from '@ngx-formly/ionic';
import { withFormlyFieldToggle } from '@ngx-formly/ionic/toggle';

export const appConfig: ApplicationConfig = {
  providers: [provideIonicAngular(), provideFormlyCore([...withFormlyIonic(), withFormlyFieldToggle()])],
};
```

Use `props.interface` and `props.interfaceOptions` to configure Ionic select overlays. See [select interfaces](https://github.com/ngx-formly/ngx-formly/blob/main/docs/properties-options.md#ionic-select-interfaces).

## Which Version to use?

Match `@ngx-formly/ionic` to your `@ngx-formly/core` version, and check the migration guide for UI library requirements.

| Angular version | Formly version       | Migration                          |
| --------------- | -------------------- | ---------------------------------- |
| Angular >= 22   | `@ngx-formly/ionic@11.x` | [Upgrade to v11](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-11.0.md)    |
| Angular >= 21   | `@ngx-formly/ionic@10.x` | [Upgrade to v10](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-10.0.md)    |
| Angular >= 20   | `@ngx-formly/ionic@9.x` | [Upgrade to v9](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-9.0.md)      |
| Angular >= 19   | `@ngx-formly/ionic@8.x` | [Upgrade to v8](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-8.0.md)      |
| Angular >= 18   | `@ngx-formly/ionic@7.x` | [Upgrade to v7](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-7.0.md)      |
| Angular >= 13   | `@ngx-formly/ionic@6.x` | [Upgrade to v6](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-6.0.md)      |
| Angular >= 7    | `@ngx-formly/ionic@5.x` | [Upgrade to v5](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-5.0.md)      |
| Angular >= 6    | `@ngx-formly/ionic@4.x` |                                    |
| Angular >= 5    | `@ngx-formly/ionic@3.x` |                                    |
| Angular >= 4    | `@ngx-formly/ionic@2.x` | [Upgrade to v2](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-2.0.md)      |

## Documentation

- [Ionic examples](https://formly.dev/ui/ionic)
- [Formly guide](https://formly.dev/guide)
- [Source](https://github.com/ngx-formly/ngx-formly/tree/main/src/ui/ionic)
