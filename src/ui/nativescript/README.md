# @ngx-formly/nativescript

NativeScript field types and wrappers for Formly. This adapter renders native mobile controls with Angular Reactive Forms in a NativeScript Angular application.

## Installation

Formly 11 requires Angular 22 or newer, `@nativescript/angular` 22 or newer, and `@nativescript/core` 8.1 or newer. Use an `@angular/forms` version matching your application, and keep all `@ngx-formly/*` packages on the same version.

In an existing NativeScript Angular application:

```sh
npm install @ngx-formly/core@^11 @ngx-formly/nativescript@^11
```

Use the [NativeScript Angular documentation](https://docs.nativescript.org/tutorials/build-a-master-detail-app-with-angular) to set up the native application and its platform tooling.

## Configuration

Import the following module in your root NgModule. Keep the NativeScript bootstrap and application imports already present in your project.

```ts
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyNativescriptModule } from '@ngx-formly/nativescript';

@NgModule({
  imports: [ReactiveFormsModule, FormlyModule.forRoot(), FormlyNativescriptModule],
  exports: [ReactiveFormsModule, FormlyModule],
})
export class AppFormsModule {}
```

Import `FormlyModule` in any feature module that declares a component using `<formly-form>`.

## Usage

Define the form in your page component:

```ts
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

export class ExampleComponent {
  form = new FormGroup({});
  model = { email: '' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      props: {
        label: 'Email',
        hint: 'Enter your email',
        keyboardType: 'email',
        required: true,
      },
    },
  ];
}
```

Add Formly to the page's NativeScript template:

```html
<StackLayout>
  <formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>
</StackLayout>
```

## Field types

| Field type            | Native control                             |
| --------------------- | ------------------------------------------ |
| `input`, `text-field` | `TextField`                                |
| `textarea`            | `TextView`                                 |
| `checkbox`            | `Switch`                                   |
| `radio`               | Labeled switches for the available options |
| `select`              | Button that opens a native action dialog   |

The `form-field` wrapper displays labels and validation messages in NativeScript layouts. Input properties include `hint`, `keyboardType`, `secure`, and `autocorrect`.

## Which Version to use?

Match `@ngx-formly/nativescript` to your `@ngx-formly/core` version, and check the migration guide for UI library requirements.

| Angular version | Formly version       | Migration                          |
| --------------- | -------------------- | ---------------------------------- |
| Angular >= 22   | `@ngx-formly/nativescript@11.x` | [Upgrade to v11](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-11.0.md)    |
| Angular >= 21   | `@ngx-formly/nativescript@10.x` | [Upgrade to v10](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-10.0.md)    |
| Angular >= 20   | `@ngx-formly/nativescript@9.x` | [Upgrade to v9](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-9.0.md)      |
| Angular >= 19   | `@ngx-formly/nativescript@8.x` | [Upgrade to v8](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-8.0.md)      |
| Angular >= 18   | `@ngx-formly/nativescript@7.x` | [Upgrade to v7](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-7.0.md)      |
| Angular >= 13   | `@ngx-formly/nativescript@6.x` | [Upgrade to v6](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-6.0.md)      |
| Angular >= 7    | `@ngx-formly/nativescript@5.x` | [Upgrade to v5](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-5.0.md)      |
| Angular >= 6    | `@ngx-formly/nativescript@4.x` |                                    |
| Angular >= 5    | `@ngx-formly/nativescript@3.x` |                                    |
| Angular >= 4    | `@ngx-formly/nativescript@2.x` | [Upgrade to v2](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-2.0.md)      |

## Documentation

- [Formly guide](https://formly.dev/guide)
- [NativeScript Angular](https://docs.nativescript.org/tutorials/build-a-master-detail-app-with-angular)
- [Source](https://github.com/ngx-formly/ngx-formly/tree/main/src/ui/nativescript)
