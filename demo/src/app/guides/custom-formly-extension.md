# Custom Extensions

Extensions are a versatile formly feature that allows you to implement cross-cutting functionality that can be applied to all of your fields.

Internally, a lot of formly's logic is built on extensions, so understanding them can greatly increase the things you can do with formly. If you're looking for more resources and examples, check out these links:
- [Egghead.io courses on extensions](https://egghead.io/lessons/angular-implement-cross-cutting-functionality-with-angular-formly-extensions)
- [Example: using an extension to internationalize forms](https://formly.dev/examples/advanced/i18n-alternative)
- [Example: using an extension to include animations in forms](https://formly.dev/examples/other/hide-fields-with-animations)


## Creating a Custom Extension

Creating a custom extension is easy. The following example creates an extension that defines a default label if the `FormlyFieldConfig` doesn't define one itself.

See live demo: [demo](https://stackblitz.com/edit/ngx-formly-ui-bootstrap-slzm3p?file=src/app/app.component.ts)

  1. Define the custom extension:

    There are two options when writing an extension:
    - Create an object of type `FormlyExtension`.
    - Create a class implementing the interface `FormlyExtension`. Do this if your [extension comes with any dependencies](https://formly.dev/examples/advanced/i18n-alternative).
    
    For this simple example, we will choose the first option.

    ```typescript
    // default-label-extension.ts
    import { FormlyExtension } from '@ngx-formly/core';

    export const defaultLabelExtension: FormlyExtension = {
      prePopulate(field): void {
        if (field.templateOptions?.label) {
          return;
        }
        field.templateOptions = {
          ...field.templateOptions,
          label: 'Default Label'
        }
      },
    };
    ```

    > Note: `FormlyExtension` allows you to define up to three methods that will be called in this order during the form construction process:
    > `prePopulate`, `onPopulate` and `postPopulate`

  2. Register the custom extension in `NgModule` declaration:
    ```typescript
    // app.module.ts
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { ReactiveFormsModule } from '@angular/forms';

    import { FormlyModule } from '@ngx-formly/core';
    import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

    import { AppComponent } from './app.component';
    import { defaultLabelExtension } from './default-label-extension';

    @NgModule({
      imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormlyBootstrapModule,
        FormlyModule.forRoot({
          extensions: [
            {
              name: 'default-label',
              extension: defaultLabelExtension
            }
          ]
        })
      ],
      declarations: [AppComponent],
      bootstrap: [AppComponent]
    })
    export class AppModule {}
    ```

    `extensions: [ ... ]` is where we define which extensions should be active.

  3. Create a custom FormlyFieldConfig and see the magic happen:

    ```typescript
     fields: FormlyFieldConfig[] = [
      {
        key: 'input',
        type: 'input',
        templateOptions: {
          label: 'Basic Input'
        }
      },
      {
        key: 'input2',
        type: 'input'
      }
    ];

    ```

  Look at the demo to see that the default label has been automatically added to the field.

## Extension priority
When registering an extension with the `FormlyModule`, you can provide an additional `priority` property of type `number`.
This will be used to change the order in which extensions are executed. If you have multiple extensions that change the same properties of a `FormlyFieldConfig`, you can use this to ensure they are executed in the correct order. Extensions with higher `priority` values will be executed later.

If you don't provide a `priority` option, a default value of `1` will be used. <br/>
Formly's own internal extensions have a priority of `-1`.

```typescript
  FormlyModule.forRoot({
    extensions: [
      {
        name: 'default-label',
        extension: defaultLabelExtension,
        priority: 3
      }
    ]
  })
```

