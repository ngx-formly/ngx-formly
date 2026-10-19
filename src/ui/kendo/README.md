# @ngx-formly/kendo

Kendo UI for Angular field types and wrappers for Formly. This adapter renders Kendo inputs, dropdowns, labels, and validation messages with Angular Reactive Forms.

## Installation

For Formly 11, use Angular 22 or newer and Kendo Angular inputs, dropdowns, and labels 25.3 or newer. Keep all `@ngx-formly/*` packages on the same version, and use an `@angular/forms` version matching your application.

In an Angular application with Reactive Forms installed:

```sh
npm install @ngx-formly/core@^11 @ngx-formly/kendo@^11 @progress/kendo-angular-inputs @progress/kendo-angular-dropdowns @progress/kendo-angular-label
```

Set up Kendo UI and a Kendo theme in your application using the [Kendo Angular setup guide](https://www.telerik.com/kendo-angular-ui/components/getting-started). Follow its licensing and peer dependency instructions as well.

## Configuration

Add the adapter to your application providers in `app.config.ts`:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyKendo } from '@ngx-formly/kendo';

export const appConfig: ApplicationConfig = {
  providers: [provideFormlyCore(withFormlyKendo())],
};
```

## Usage

This field renders an email input using Kendo UI:

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

`withFormlyKendo()` registers `input`, `textarea`, `checkbox`, `radio`, and `select`, together with their form-field wrapper.

An `input` with `props.type: 'number'` renders a Kendo NumericTextBox. Other input types use the Kendo TextBox directive.

Individual registrations are also available from entry points such as `@ngx-formly/kendo/input` and `@ngx-formly/kendo/select`.

## Which Version to use?

Match `@ngx-formly/kendo` to your `@ngx-formly/core` version, and check the migration guide for UI library requirements.

| Angular version | Formly version       | Migration                          |
| --------------- | -------------------- | ---------------------------------- |
| Angular >= 22   | `@ngx-formly/kendo@11.x` | [Upgrade to v11](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-11.0.md)    |
| Angular >= 21   | `@ngx-formly/kendo@10.x` | [Upgrade to v10](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-10.0.md)    |
| Angular >= 20   | `@ngx-formly/kendo@9.x` | [Upgrade to v9](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-9.0.md)      |
| Angular >= 19   | `@ngx-formly/kendo@8.x` | [Upgrade to v8](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-8.0.md)      |
| Angular >= 18   | `@ngx-formly/kendo@7.x` | [Upgrade to v7](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-7.0.md)      |
| Angular >= 13   | `@ngx-formly/kendo@6.x` | [Upgrade to v6](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-6.0.md)      |
| Angular >= 7    | `@ngx-formly/kendo@5.x` | [Upgrade to v5](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-5.0.md)      |
| Angular >= 6    | `@ngx-formly/kendo@4.x` |                                    |
| Angular >= 5    | `@ngx-formly/kendo@3.x` |                                    |
| Angular >= 4    | `@ngx-formly/kendo@2.x` | [Upgrade to v2](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-2.0.md)      |

## Documentation

- [Kendo UI examples](https://formly.dev/ui/kendo)
- [Formly guide](https://formly.dev/guide)
- [Source](https://github.com/ngx-formly/ngx-formly/tree/main/src/ui/kendo)
