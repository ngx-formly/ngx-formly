# Setup and a first form

Check the project's installed exports before choosing either setup below. Standalone Formly APIs arrived in v7; the NgModule APIs remain supported. Match the application instead of converting its architecture as part of an unrelated form change.

## Standalone registration

This Bootstrap example uses `provideFormlyCore` and `withFormlyBootstrap`. Use the equivalent exports from the application's chosen adapter, and follow that adapter's setup for styles, UI providers, and additional field entry points.

```ts
import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [provideFormlyCore(withFormlyBootstrap())],
};
```

Merge this registration into the existing providers. Keep root registration shared. For additional types or validators in a feature, use `provideFormlyConfig` when available rather than creating another root `FormlyConfig` with `provideFormlyCore`.

## NgModule registration

At the application root, import `ReactiveFormsModule`, `FormlyModule.forRoot(config)`, and the chosen adapter module, such as `FormlyBootstrapModule`. Import `FormlyModule` in feature modules that render forms; use `FormlyModule.forChild(config)` when the feature adds configuration. Standalone consumers of older Formly versions can import the modules and register root providers through Angular's `importProvidersFrom`.

Installing core alone does not register UI types such as `input` or `select`. Reuse the application's adapter, or register custom types if it has its own design system. Some adapter controls have separate entry points; verify the adapter's exports and README before choosing a date picker or other optional control.

## Component

This example assumes a registered `input` type and Formly's standalone exports. In an NgModule application, put the component in the appropriate module and supply its imports there.

```ts
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyForm],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>
      <button type="submit">Save</button>
    </form>
  `,
})
export class ProfileFormComponent {
  form = new FormGroup({});
  model = { name: '' };
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      props: { label: 'Name', required: true },
      validation: { messages: { required: 'Enter your name.' } },
    },
  ];

  submit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    // Connect the application's save operation here.
  }
}
```

Supply the actual save operation when implementing the form. Keep `form`, `fields`, and `options` as stable component properties rather than recreating them in template getters.

For reset, use Formly's `options.resetModel()` to restore its initial model, or `options.resetModel(nextModel)` to set a new baseline. Reset the surrounding Angular form directive's submitted state too when the UI needs it. Formly populates these option methods during form construction, so call them after the form is built.

## Sources

- [Getting started](https://formly.dev/guide)
- [v7 standalone migration](https://github.com/ngx-formly/ngx-formly/blob/main/UPGRADE-7.0.md)
- [Adapter setup and supported fields](https://formly.dev/ui)
