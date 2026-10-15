# @ngx-formly/ng-zorro-antd

NG-ZORRO Ant Design field types and wrappers for Formly. This adapter renders NG-ZORRO controls and form items with Angular Reactive Forms.

## Installation

For Formly 11, use Angular 22 or newer and NG-ZORRO 22 or newer. Keep all `@ngx-formly/*` packages on the same version, and use an `@angular/forms` version matching your application.

In an Angular application with Reactive Forms installed:

```sh
npm install @ngx-formly/core@^11 @ngx-formly/ng-zorro-antd@^11 ng-zorro-antd@^22
```

Add `node_modules/ng-zorro-antd/ng-zorro-antd.min.css` to the build target's `styles` array in `angular.json`. See the [NG-ZORRO setup guide](https://ng.ant.design/docs/getting-started/en) for application setup and locale options.

## Configuration

Add the adapter to your application providers in `app.config.ts`:

```ts
import { ApplicationConfig } from '@angular/core';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyNgZorroAntd } from '@ngx-formly/ng-zorro-antd';

export const appConfig: ApplicationConfig = {
  providers: [provideNzI18n(en_US), provideFormlyCore(withFormlyNgZorroAntd())],
};
```

## Usage

This field renders an email input using NG-ZORRO:

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

`withFormlyNgZorroAntd()` registers `input`, `textarea`, `checkbox`, `radio`, and `select`, together with their form-field wrapper.

An `input` with `props.type: 'number'` renders `nz-input-number`. Other input types use the `nz-input` directive. The `form-field` wrapper supplies labels, help text, and validation feedback.

Individual registrations are also available from entry points such as `@ngx-formly/ng-zorro-antd/input` and `@ngx-formly/ng-zorro-antd/select`.

## Which Version to use?

Match `@ngx-formly/ng-zorro-antd` to your `@ngx-formly/core` version, and check the migration guide for UI library requirements.

| Angular version | Formly version       | Migration                          |
| --------------- | -------------------- | ---------------------------------- |
| Angular >= 22   | `@ngx-formly/ng-zorro-antd@11.x` | [Upgrade to v11](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-11.0.md)    |
| Angular >= 21   | `@ngx-formly/ng-zorro-antd@10.x` | [Upgrade to v10](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-10.0.md)    |
| Angular >= 20   | `@ngx-formly/ng-zorro-antd@9.x` | [Upgrade to v9](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-9.0.md)      |
| Angular >= 19   | `@ngx-formly/ng-zorro-antd@8.x` | [Upgrade to v8](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-8.0.md)      |
| Angular >= 18   | `@ngx-formly/ng-zorro-antd@7.x` | [Upgrade to v7](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-7.0.md)      |
| Angular >= 13   | `@ngx-formly/ng-zorro-antd@6.x` | [Upgrade to v6](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-6.0.md)      |
| Angular >= 7    | `@ngx-formly/ng-zorro-antd@5.x` | [Upgrade to v5](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-5.0.md)      |
| Angular >= 6    | `@ngx-formly/ng-zorro-antd@4.x` |                                    |
| Angular >= 5    | `@ngx-formly/ng-zorro-antd@3.x` |                                    |
| Angular >= 4    | `@ngx-formly/ng-zorro-antd@2.x` | [Upgrade to v2](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-2.0.md)      |

## Documentation

- [NG-ZORRO examples](https://formly.dev/ui/ng-zorro-antd)
- [Formly guide](https://formly.dev/guide)
- [Source](https://github.com/ngx-formly/ngx-formly/tree/main/src/ui/ng-zorro-antd)
