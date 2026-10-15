# @ngx-formly/core

Formly builds Angular Reactive Forms from field configuration objects. Core manages the form model, validation, expressions, custom field types, and wrappers. Choose a UI adapter for ready-made controls, or register your own components.

## Installation

Formly 11 requires Angular 22 or newer and RxJS `^6.5.3` or `^7.0.0`. Use an `@angular/forms` version matching your application, and keep all `@ngx-formly/*` packages on the same version.

In an Angular application with Reactive Forms installed:

```sh
npm install @ngx-formly/core@^11
```

## Choose a UI adapter

| Package                                                                              | Controls             |
| ------------------------------------------------------------------------------------ | -------------------- |
| [@ngx-formly/bootstrap](https://www.npmjs.com/package/@ngx-formly/bootstrap)         | Bootstrap            |
| [@ngx-formly/material](https://www.npmjs.com/package/@ngx-formly/material)           | Angular Material     |
| [@ngx-formly/ionic](https://www.npmjs.com/package/@ngx-formly/ionic)                 | Ionic                |
| [@ngx-formly/primeng](https://www.npmjs.com/package/@ngx-formly/primeng)             | PrimeNG              |
| [@ngx-formly/kendo](https://www.npmjs.com/package/@ngx-formly/kendo)                 | Kendo UI for Angular |
| [@ngx-formly/ng-zorro-antd](https://www.npmjs.com/package/@ngx-formly/ng-zorro-antd) | NG-ZORRO Ant Design  |
| [@ngx-formly/nativescript](https://www.npmjs.com/package/@ngx-formly/nativescript)   | NativeScript         |

Each package documents its dependencies, styling, and field registrations. Core alone does not register an `input` type.

## Configuration and usage

For example, install the Bootstrap adapter and follow its styling instructions:

```sh
npm install @ngx-formly/bootstrap@^11 bootstrap@^5
```

Register it in `app.config.ts`:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [provideFormlyCore(withFormlyBootstrap())],
};
```

Import `FormlyForm` and `ReactiveFormsModule` in the component that displays the form:

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

The field's `key` identifies the model property, `type` selects a registered component, and `props` configures that component. Formly creates the controls inside the supplied `FormGroup`.

## Additional entry points

These ship with `@ngx-formly/core` and do not need separate npm installs:

- `@ngx-formly/core/json-schema` converts JSON Schema to field configurations with `FormlyJsonschema`.
- `@ngx-formly/core/select` provides shared select-option types and the `FormlySelectOptionsPipe`.
- `@ngx-formly/core/preset` registers reusable field presets.
- `@ngx-formly/core/testing` provides helpers for testing custom Formly fields.

## Which Version to use?

| Angular version | Formly version       | Migration                          |
| --------------- | -------------------- | ---------------------------------- |
| Angular >= 22   | `@ngx-formly/core@11.x` | [Upgrade to v11](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-11.0.md)    |
| Angular >= 21   | `@ngx-formly/core@10.x` | [Upgrade to v10](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-10.0.md)    |
| Angular >= 20   | `@ngx-formly/core@9.x` | [Upgrade to v9](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-9.0.md)      |
| Angular >= 19   | `@ngx-formly/core@8.x` | [Upgrade to v8](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-8.0.md)      |
| Angular >= 18   | `@ngx-formly/core@7.x` | [Upgrade to v7](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-7.0.md)      |
| Angular >= 13   | `@ngx-formly/core@6.x` | [Upgrade to v6](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-6.0.md)      |
| Angular >= 7    | `@ngx-formly/core@5.x` | [Upgrade to v5](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-5.0.md)      |
| Angular >= 6    | `@ngx-formly/core@4.x` |                                    |
| Angular >= 5    | `@ngx-formly/core@3.x` |                                    |
| Angular >= 4    | `@ngx-formly/core@2.x` | [Upgrade to v2](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-2.0.md)      |
| Angular >= 2    | `ng-formly@1.x`       |                                    |

## Documentation

- [Formly guide](https://formly.dev/guide)
- [Custom field types](https://formly.dev/guide/custom-formly-field)
- [JSON Schema](https://formly.dev/guide/json-schema)
- [Source](https://github.com/ngx-formly/ngx-formly/tree/main/src/core)
