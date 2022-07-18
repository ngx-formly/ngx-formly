# Custom Types

## Prebuilt Types

While it is recommended to create your own templates for ultimate customization and flexibility,
there are prebuilt templates you can use:

  - Material
  - Bootstrap
  - Ionic
  - Kendo
  - PrimeNG
  - NG-ZORRO


## Creating a Custom Type

Creating a custom type is quite easy, but also very flexible. The following example shows how we can create a simple input type:

The live example can be found in stackblitz: [demo](https://stackblitz.com/edit/ngx-formly-custom-template)

  ### 1. Defining the Field Type class and its template:

  First you have to create a component representing the field which extends `FieldType` class.

  ```typescript
  import { Component } from '@angular/core';
  import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

  @Component({
    selector: 'formly-field-input',
    template: `
      <input type="input" [formControl]="formControl" [formlyAttributes]="field">
    `,
  })
  export class InputFieldType extends FieldType<FieldTypeConfig> {}
  ```

  > We passed a `formControl` instance which is created by Formly to the `input`, to let Formly know that this is the input that you want to associate with your model.

  ### 2. Register the custom type in `NgModule` declaration:

  ```typescript
  import { InputFieldType } from './intput-field.type';

  @NgModule({
    declarations: [InputFieldType],
  })
  export class AppModule {}
  ```

  ### 3. set an aliase for `InputFieldType` component (Optional):

  > Note: This step is required only for JSON powered forms (see "Method-2" below).

  ```typescript
  import { InputFieldType } from './intput-field.type';

  @NgModule({
    imports: [
      FormlyModule.forRoot({
        types: [
          { name: 'input', component: InputFieldType },
        ],
      }),
    ],
  })
  export class AppModule {}
  ```

  > `types: [ ... ]` allows you to specify a custom type which you can use in your field configuration.
  >
  > A typical Type requires two properties:
  > 1. `name`: The name of the component type. You use this in the `type` option of a field.
  > 2. `component`: the component that Formly should create when this type is set.

  ### 4. Use the created custom type in the form config:
  * Method 1: Pass the `InputFieldType` component to the field config.

    ```typescript
    import { InputFieldType } from './intput-field.type';

    export class AppComponent {
      fields: FormlyFieldConfig[] = [
        {
          key: 'firstname',
          type: InputFieldType,
        },
      ];
    }
    ```

  * Method 2: Pass the `InputFieldType` alias (defined in `FormlyModule.forRoot`) to the field config.

    ```typescript
    export class AppComponent {
      fields: FormlyFieldConfig[] = [
        {
          key: 'firstname',
          type: 'input',
        },
      ];
    }
    ```
