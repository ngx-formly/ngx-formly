# @ngx-formly/bootstrap

Bootstrap 5 field types and wrappers for Formly. This adapter renders native HTML controls with Bootstrap classes and connects them to Angular Reactive Forms.

## Installation

For Formly 11, use Angular 22 or newer and Bootstrap 5. Keep all `@ngx-formly/*` packages on the same version, and use an `@angular/forms` version matching your application.

In an Angular application with Reactive Forms installed:

```sh
npm install @ngx-formly/core@^11 @ngx-formly/bootstrap@^11 bootstrap@^5
```

Add `node_modules/bootstrap/dist/css/bootstrap.min.css` to the build target's `styles` array in `angular.json`. Bootstrap JavaScript is not required by these field types.

## Configuration

Add the adapter to your application providers in `app.config.ts`:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [provideFormlyCore(withFormlyBootstrap())],
};
```

## Usage

This field renders an email input using Bootstrap:

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

`withFormlyBootstrap()` registers `input`, `textarea`, `checkbox`, `multicheckbox`, `radio`, and `select`, together with their form-field wrapper.

The `form-field` wrapper supplies labels, descriptions, and validation messages. The `addons` wrapper supports input prefixes and suffixes through `props.addonLeft` and `props.addonRight`.

Individual registrations are also available from entry points such as `@ngx-formly/bootstrap/input` and `@ngx-formly/bootstrap/addons`.

## Which Version to use?

Match `@ngx-formly/bootstrap` to your `@ngx-formly/core` version, and check the migration guide for UI library requirements.

| Angular version | Formly version       | Migration                          |
| --------------- | -------------------- | ---------------------------------- |
| Angular >= 22   | `@ngx-formly/bootstrap@11.x` | [Upgrade to v11](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-11.0.md)    |
| Angular >= 21   | `@ngx-formly/bootstrap@10.x` | [Upgrade to v10](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-10.0.md)    |
| Angular >= 20   | `@ngx-formly/bootstrap@9.x` | [Upgrade to v9](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-9.0.md)      |
| Angular >= 19   | `@ngx-formly/bootstrap@8.x` | [Upgrade to v8](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-8.0.md)      |
| Angular >= 18   | `@ngx-formly/bootstrap@7.x` | [Upgrade to v7](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-7.0.md)      |
| Angular >= 13   | `@ngx-formly/bootstrap@6.x` | [Upgrade to v6](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-6.0.md)      |
| Angular >= 7    | `@ngx-formly/bootstrap@5.x` | [Upgrade to v5](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-5.0.md)      |
| Angular >= 6    | `@ngx-formly/bootstrap@4.x` |                                    |
| Angular >= 5    | `@ngx-formly/bootstrap@3.x` |                                    |
| Angular >= 4    | `@ngx-formly/bootstrap@2.x` | [Upgrade to v2](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-2.0.md)      |

## Documentation

- [Bootstrap examples](https://formly.dev/ui/bootstrap)
- [Formly guide](https://formly.dev/guide)
- [Source](https://github.com/ngx-formly/ngx-formly/tree/main/src/ui/bootstrap)
