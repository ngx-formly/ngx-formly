# Custom Wrapper

Custom wrappers allow you to wrap a field type with a component.

## Prebuilt Wrappers

ui-bootstrap
  - form-field
    - Shows validation messages below field.
  - addons
    - Adds input addons to a field. See [input add-ons](https://formly.dev/examples/bootstrap-specific/input-add-ons).

ui-ionic
  - form-field
    - Shows validation messages below field.

ui-kendo
  - form-field
    - Shows validation messages and label for required.

ui-material
  - form-field
    - Has label, shows validation messages, shows description, and label for required.

ui-primeng
  - form-field
    - Has label, required and validation message.

## Creating a Custom Wrapper

Creating a custom wrapper is easy, the following example shows how to create a panel wrapper around a field.

See live demo: [demo](https://stackblitz.com/angular/dleylnmrbmd?file=app%2Fapp.component.ts)

  ### 1. Defining the Custom Wrapper class and it's template:

  First you have to create a component representing the wrapper which extends `FieldWrapper` class.

  ```typescript
  // panel-wrapper.component.ts
  import { Component, ViewChild, ViewContainerRef } from '@angular/core';
  import { FieldWrapper } from '@ngx-formly/core';

  @Component({
    selector: 'formly-wrapper-panel',
    template: `
      <div class="card">
        <h3 class="card-header">Its time to party</h3>
        <h3 class="card-header">{{ props.label }}</h3>
        <div class="card-body">
          <ng-container #fieldComponent></ng-container>
        </div>
      </div>
    `,
  })
  export class PanelFieldWrapper extends FieldWrapper {
  }
  ```

  > `fieldComponent` is where the field is inserted.  (`<ng-container #fieldComponent></ng-container>`)

  > Note: `FieldWrapper` component extends `Field` therefore you can have multiple wrappers attached to one field.
  > Example you can have both a label and validator wrapper.

  ### 2. set an aliase for `PanelFieldWrapper` component in App Config (Optional):

  > Note: This step is required only for JSON powered form (see "Method-2" below).

  ```typescript
  import { PanelFieldWrapper } from './panel-wrapper.component';
  ...
  export const appConfig: ApplicationConfig = {
    providers: [
      provideFormlyCore({
        wrappers: [
          { name: 'panel', component: PanelFieldWrapper },
        ],
      }),
    ],
  };
  ```

  > `wrappers: [ ... ]` is where define what custom wrappers we want to inject into our config to use in our `FormlyFieldConfig`


  ### 3. Use the panel wrapper in the form config:
  * Method 1: Pass the `PanelFieldWrapper` component to the field config.

    ```typescript
    fields: FormlyFieldConfig[] = [
      {
        key: 'address',
        wrappers: [PanelFieldWrapper],
        props: { label: 'Address' },
        fieldGroup: [{
          key: 'town',
          type: 'input',
          props: {
            required: true,
            type: 'text',
            label: 'Town',
          },
        }],
      },
    ];
    ```
    > `wrappers: [PanelFieldWrapper]` is where FormlyFieldConfig assigns the field instance to use that panel.

  * Method 2: Pass the `PanelFieldWrapper` alias (defined in `provideFormlyCore`) to the field config.

    ```typescript
    fields: FormlyFieldConfig[] = [
      {
        key: 'address',
        wrappers: ['panel'],
        props: { label: 'Address' },
        fieldGroup: [{
          key: 'town',
          type: 'input',
          props: {
            required: true,
            type: 'text',
            label: 'Town',
          },
        }],
      },
    ];
    ```

    > `wrappers: ['panel']` is where FormlyFieldConfig assigns the field instance to use that panel.

## Creating default wrappers for components

Sometimes you always want a components with certain wrappers.

  ```typescript
  ... //Imports
  export const appConfig: ApplicationConfig = {
    providers: [
      provideFormlyCore({
        types: [
          {
            name: 'operator',
            component: OperatorComponent,
            wrappers: ['form-field']
          },
        ],
      }),
    ],
  };
  ```
You can do this by setting the `wrappers: ['form-field']` to that type in the config
