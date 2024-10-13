# FAQ

## Rendering Dynamic HTML template using ngx-formly at runtime

it's not possible due to Angular limitation on that part (require to use Angular compiler in browser),
so instead use one of the following solutions:

1- create a [Custom component type](./guide/custom-formly-field)

2- use `expressions`:

```
{
  expressions: {
    template: field => `<div>${field.model.label}</div>`
  }
}
```

3- use inline type:

```patch
@Component({
  selector: 'app',
  template: `
    <formly-form [form]="form" [fields]="fields" [model]="model">
+     <ng-template formlyTemplate="custom-inline-type" let-field>
+        Hello {{ field.props.name }}
+     </ng-template>
    </formly-form>
  `,
})
export class AppComponent {
  ...
  fields: FormlyFieldConfig[] = [
    {
+     type: 'custom-inline-type',
+     props: {
        name: 'World !!!',
      }
    }
  ];
}
```

## How to access to the parent field model value:

To access into the main model you have to use:
- `formState`
- or use the `this.model` defined on your main component, see https://stackblitz.com/edit/angular-formly-6nvp4q
- or `field.parent.model` to get the parent model value

## What is `hooks` in Formly

The `hooks` are callbacks that give you the opportunity to interact with the field instance when an event happens in the field's life cycle.
The most relevant `hooks` are:

- `onInit`: Called once, after the after field has been initialized;
- `afterViewInit`: Called after Angular initializes the component's views and child views.
- `onDestroy`: Called before Angular destroys the field component.

### Usage

```ts
fields: FormlyFieldConfig[] = [
  {
    type: 'input',
    hooks: {
      onInit: (field) => {
        const { form, model, options } = field;
        ...
      },
    },
  }
];
```

## What does `templateOptions` and `props` in Formly:

`templateOptions` is an alias to `props`, which allows passing extra option to the field ui template. For example we can use it to pass a custom label/placeholder or set the input field as required.

### Usage

The following example will mark the field as `required` and set label to `Name`

```ts
fields: FormlyFieldConfig[] = [
  {
    type: 'input',
    props: {
      label: 'Name',
      required: true
    },
  }
];
```

## The pipe `formlySelectOptions` could not be found

If you receive a 'pipe could not be found' error, such as the one below, make sure to import the necessary modules.

```
Template parse errors:
The pipe 'formlySelectOptions' could not be found
```

In this error, the `formlySelectOptions` pipe is part of `FormlySelectModule`. This must be imported into the application before templates, including your custom templates, can use the pipe.

```typescript
import { FormlySelectModule } from '@ngx-formly/core/select';

@NgModule({
  imports: [
    ...
    FormlySelectModule,
  ],
})
export class AppModule { }
```

## Formly standalone components support

Standalone components support will be added in the next major version (`v7`) of Formly.
In the meantime, you can use the following solution: https://github.com/ngx-formly/ngx-formly/issues/3721#issuecomment-1602401526.

## How to add `className` to `formly-field` component:

If you want to apply a custom style for a specific field, use `className` property:

```ts
{
  className: 'custom-class',
  key: 'name',
  ...
}
```

Result:

```html
<formly-field class="custom-class">...<formly-field>
```

## How to apply style to a child element of field ?

use `className` which will be added to the `formly-field` component and then target the child element using `css`:

```ts
{
  className: 'my-custom-style',
  key: 'name',
  ...
}
```

`style.scss`:

```scss
.my-custom-style .mat-form-field {
}
```

## How to get the model value associated with a field instance

To access the model's value you can use `field.model` which return the parent model value. Example:

```typescript
const model = { city: "test" };
const field = { key: "city", type: "input" };

...

console.log(field.model)
// output: { city: "test" }
```

When `fieldGroup` or `fieldArray` is set and the `key` is present the returned value from model is the current field value.
in order to get the parent model value use `field.parent.model`. Example:


```typescript
const model = { address: { city: "test" } };
const field = { key: "address", fieldGroup: [] };

...

console.log(field.model)
// output: { city: "test" }


console.log(field.parent.model)
// output: { address: { city: "test" } }
```
