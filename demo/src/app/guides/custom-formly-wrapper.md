# Custom Wrapper

Custom wrappers allows you to wrap a field type with a component.

## Prebuilt Wrappers

ui-bootstrap
  - form-field
    - Shows validation messages bellow field.
  - addons

ui-ionic
  - form-field
    - Shows validation messages bellow field.

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

  1. Defining the Custom Wrapper class and it's template:

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
        <h3 class="card-header">{{ to.label }}</h3>
        <div class="card-body">
          <ng-container #fieldComponent></ng-container>
        </div>
      </div>
    `,
  })
  export class PanelWrapperComponent extends FieldWrapper {
  }
  ```

  `fieldComponent` is where the field is inserted.  (`<ng-container #fieldComponent></ng-container>`)

  > Note: `FieldWrapper` component extends `Field` therefore you can have multiple wrappers attached to one field.
  > Example you can have both a label and validator wrapper.

  2. Register the custom wrapper in `NgModule` declaration:
  Module
  ```typescript
  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { ReactiveFormsModule } from '@angular/forms';
  import { FormlyModule } from '@ngx-formly/core';
  import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

  import { PanelWrapperComponent } from './panel-wrapper.component';
  import { AppComponent } from './app.component';

  @NgModule({
    imports: [
      CommonModule,
      ReactiveFormsModule,
      FormlyBootstrapModule,
      FormlyModule.forRoot({
        wrappers: [
          { name: 'panel', component: PanelWrapperComponent },
        ],
      }),
    ],
    declarations: [
      AppComponent,
      PanelWrapperComponent,
    ],
  })
  export class AppModule { }
  ```

  `wrappers: [ ... ]` is where define what custom wrappers we want to inject into our module to use in our `FormlyFieldConfig`

  3. Create a custom FormlyFieldConfig that uses that type.

  ```typescript
  fields: FormlyFieldConfig[] = [
    {
      key: 'address',
      wrappers: ['panel'],
      templateOptions: { label: 'Address' },
      fieldGroup: [{
        key: 'town',
        type: 'input',
        templateOptions: {
          required: true,
          type: 'text',
          label: 'Town',
        },
      }],
    },
  ];

  ```

  `wrappers: ['panel'],` is where FormlyFieldConfig assigns the field instance to use that panel.

## Creating default wrappers for components

Sometimes you always want a components with certain wrappers.

  ```typescript
  ... //Imports
  @NgModule({
    imports: [
      CommonModule,
      ReactiveFormsModule,
      FormlyBootstrapModule,
      FormlyModule.forRoot({
        types: [
          {
            name: 'operator',
            component: OperatorComponent,
            wrappers: ['form-field']
          },
        ],
      }),
    ],
    declarations: [
      AppComponent,
      OperatorComponent
    ],
  })
  export class AppModule { }
  ```
You can do this by setting the `wrappers: ['form-field']` to that type in the module
