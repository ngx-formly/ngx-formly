# Custom Templates

## Prebuilt Templates

While it is recommended to create your own templates for ultimate customization and flexibility,
there are prebuilt templates you can use:

  - Material
  - Bootstrap
  - Ionic
  - Kendo
  - PrimeNG


## Creating a Custom Template

Creating a custom template is quite easy, but also very flexible, the following example shows how we can create a simple input type:

The live example can be found in stackblitz: https://stackblitz.com/edit/ngx-formly-custom-template

1. Defining the Field Type class and it's template:

  First you have to create a component representing the field which extends `FieldType` class.

  ```typescript
  import { Component } from '@angular/core';
  import { FieldType } from '@ngx-formly/core';

  @Component({
    selector: 'formly-field-input',
    template: `
      <input type="input" [formControl]="formControl" [formlyAttributes]="field">
    `,
  })
  export class FormlyFieldInput extends FieldType {}
  ```

  We passed a `formControl` instance which is created by Formly, to let Formly know that this is the input that you want to associate with your model.

2. Register the custom type in `NgModule` declaration:

  ```typescript
  import { FormlyFieldInput } from './formly-field-input';

  @NgModule({
    declarations: [FormlyFieldInput],
    imports: [
      ....
      FormlyModule.forRoot({
        types: [
          { name: 'input', component: FormlyFieldInput },
        ],
      }),
    ],
  })
  export class AppModule {}
  ```

  `types` allows you to specify a custom type which you can use in your field configuration.

  A typical Type require two properties:

  1. `name`: The name of the template type. You use this in the `type` option of a field.
  2. `component`: the component that Formly should create when this type is set.

3. Use the created custom type in the form config:

  ```typescript
  export class AppComponent {
    fields: FormlyFieldConfig[] = [
      {
        key: 'firstname',
        type: 'input',
      },
    ];

    ...
  }
  ```
