<div align="center">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/xNiCHsSAsXo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

# Quick Start

Follow these steps to get started with Ngx Formly. Also check out our [demos](https://formly.dev/examples) for further examples.

### 1. Install Formly packages:

  - Installing with `ng add` (recommended):
    ```bash
    ng add @ngx-formly/schematics --ui-theme=bootstrap
    ```

    - `ui-theme`: is an optional flag which allows choosing the UI theme to install along with the core package; choose one of the following themes:
      - `bootstrap`
      - `material`
      - `ng-zorro-antd`
      - `ionic`
      - `primeng`
      - `kendo`
      - `nativescript`

  - Installing with `npm`:
    ```bash
    npm install @angular/forms @ngx-formly/core @ngx-formly/bootstrap --save
    ```
    - replace `bootstrap` with one of the following available themes: `material`, `ionic`, `primeng`, `kendo`, `nativescript`.

  Once installed, import the config in the `app.config.ts`:

```patch
import { ApplicationConfig } from '@angular/core';
+ import { provideFormlyCore } from '@ngx-formly/core'
+ import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [
+   provideFormlyCore(withFormlyBootstrap()),
  ],
};
```

### 2. add `<formly-form>` inside the `form` tag to your `AppComponent` template:

  ```html
  <form [formGroup]="form" (ngSubmit)="onSubmit(model)">
    <formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>
    <button type="submit" class="btn btn-default">Submit</button>
  </form>
  ```

  The `<formly-form>` component is the main container of the form, which will build and render form fields, it accept the following inputs:

  - `fields`: The field configurations for building the form.
  - `form`: The form instance which allow to track model value and validation status.
  - `model`: The model to be represented by the form.

  For more details check [Properties and Options](./guide/properties-options).

### 3. Configure our defined form:

  ```ts
  import { Component } from '@angular/core';
  import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
  import { FormlyForm, FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

  @Component({
    selector: 'app',
    template: `
      <form [formGroup]="form" (ngSubmit)="onSubmit(model)">
        <formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>
        <button type="submit" class="btn btn-default">Submit</button>
      </form>
    `,
    imports: [ReactiveFormsModule, FormlyForm],
  })
  export class AppComponent {
    form = new FormGroup({});
    model = { email: 'email@gmail.com' };
    fields: FormlyFieldConfig[] = [
      {
        key: 'email',
        type: 'input',
        props: {
          label: 'Email address',
          placeholder: 'Enter email',
          required: true,
        }
      }
    ];

    onSubmit(model) {
      console.log(model);
    }
  }
  ```

  That's it, the above example will render an email input 
  that is marked required and filled with 'email@gmail.com' value.

  <div align="center">
    <iframe width="560" height="315" src="https://stackblitz.com/edit/formly-starter-example?ctl=1&embed=1&file=src/app/app.component.html&hideExplorer=1&hideNavigation=1&view=preview"></iframe>
  </div>

  From there, it's just JavaScript. Allowing for DRY, maintainable, reusable forms.

<hr />

To learn more, check out the [Formly @eggheadio course 🔥](https://egghead.io/playlists/configuration-based-reactive-angular-forms-with-ngx-formly-465f) by Juri Strumpflohner ([Twitter](https://twitter.com/juristr) - [Blog](https://juristr.com/blog)).
