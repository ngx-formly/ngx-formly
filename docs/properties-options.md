# Properties and Options

## Formly Form

Everything starts with the `formly-form`. General use of it will look something like this:

```html
<formly-form
  [form]="form"
  [fields]="fields"
  [model]="model">
</formly-form>
```

### Inputs

| Name    | Type                   | Default             | Required      | Description   |
| ------- | ---------------------- | ------------------- | ------------- | ------------- |
| form    | `FormGroup` or `FormArray` | `new FormGroup({})` | no            | The form instance which allow to track model value and validation status. |
| fields  | `FormlyFieldConfig[]`  |                     | yes           | The field configurations for building the form. |
| model   | `any`                  |                     | yes           | The model to be represented by the form. |
| options | `FormlyFormOptions`    |                     | no            | Options for the form. |


### Initial validation status

The form's `statusChanges` emits its initial status after the first successful build, including when it remains
`VALID`. This notification does not emit a value change or repeat for unchanged rebuilds. Subscribe before
binding the form to receive it. Async validators can subsequently emit their resolved status.
If validation expressions change the status during the initial build, a final notification corrects any earlier status.

### Outputs

| Name          | Description    |
| ------------- | -------------- |
| (modelChange) | Fired on model value change |
| (formChange) | Emits the built `FormGroup` or `FormArray` when the `fields` or `form` input changes, including their initial binding. |

### Accessing controls after a build

Use `(formChange)` to access controls after Formly builds the form, including when fields load asynchronously:

```html
<formly-form [form]="form" [fields]="fields" [model]="model" (formChange)="onFormChange($event)"></formly-form>
```

The handler receives the form after its controls, default values, validation and expressions have been initialized.
You can subscribe to a control's `valueChanges` or `statusChanges` there. Replace previous subscriptions when the
handler runs again and unsubscribe when the host component is destroyed. The
[JSON-powered example](https://formly.dev/examples/other/json-powered) uses Angular's `AsyncPipe` for this cleanup.

The event fires once per input update, even when both `fields` and `form` change together. It does not fire for
model-only changes, control value changes, repeat add/remove actions or direct calls to `options.build()`.
It signals that the controls are available; it does not wait for asynchronous validators or browser rendering.

## fields

| Attribute            | Type         | Description   |
| ---------            | -----        | ------------- |
| key                  | `string`     | The key that relates to the model. This will link the field value to the model. |
| id                   | `string`     | This allows you to specify the `id` of your field. Note, the `id` is generated if not set. |
| name                 | `string`     | If you wish, you can specify a specific `name` for your field. This is useful if you're posting the form to a server using techniques of yester-year. |
| type                 | `string`     | The `type` of field to be rendered. More information over at Custom templates. |
| className            | `string`     | You can specify your own class that will be applied to the `formly-field` directive. |
| props      | `object`     | This is reserved for the templates. Any template-specific options go in here. Look at your specific template implementation to know the options required for this. |
| templateOptions      | `object`     | This is reserved for the templates. Any template-specific options go in here. Look at your specific template implementation to know the options required for this. @deprecated use `props` instead |
| template             | `string`     | Can be set instead of `type` to render custom `html` content. |
| defaultValue         | `any` | If this is provided and the value of the model at compile-time is `undefined`, then the value of the model will be assigned the defaultValue. |
| hide                 | `boolean`    | Whether to hide the field. Defaults to false. If you wish this to be conditional use `expressions: { hide: ... }`. |
| hideExpression       | `boolean`/`string`/`function` | Conditionally hide the field based on values from other fields. @deprecated use `expressions: { hide: ... }` instead |
| expressions | `boolean`/`string`/`function` | An object where the key is a property to be set on the main field config and the value is an expression used to assign that property. |
| focus                | `boolean`    | Whether to focus or blur the element field. Defaults to false. If you wish this to be conditional use `expressions` |
| wrappers             | `string[]`   | It is expected to be the name of the wrappers. The formly field template will be wrapped by the first wrapper, then the second, then the third, etc. You can also specify these as part of a type (which is the recommended approach). |
| parsers              | `function[]` | Array of functions to execute, as a pipeline, whenever the model updates, usually via user input. |
| fieldGroup           | `FormlyFieldConfig[]` | A field group is a way to group fields together, making advanced layout very simple. It can also be used to group fields that are associated with the same model (useful if it's different than the model for the rest of the fields). |
| fieldArray           | `FormlyFieldConfig` | |
| fieldGroupClassName  | `string` | Specify your own class that will be applied to the `formly-group` component. |
| validation           | `object` | An object with a few useful properties: messages, show |
| validators           | `any` | Used to set validation rules for a particular field. Should be an object of key - value pairs. The value can either be an expression to evaluate or a function to run. Each should return a boolean value, returning true when the field is valid. See Validation for more information. |
| asyncValidators      | `any` | Use this one for anything that needs to validate asynchronously. Pretty much exactly the same as the validators api, except it must be a function that returns a promise. |
| formControl          | `AbstractControl` | This is the [FormControl](https://angular.io/api/forms/FormControl) for the field. It provides you more control like running validators, calculating status, and resetting state. |
| modelOptions         | `object` | An object with a few useful properties to control the model changes: `debounce`, `updateOn` |


## Ionic select interfaces

Ionic select fields accept `props.interfaceOptions` to configure their alert, action sheet, or popover:

```ts
{
  key: 'choice',
  type: 'select',
  props: {
    interface: 'popover',
    interfaceOptions: { size: 'cover' },
    options: [{ label: 'First option', value: 1 }],
  },
}
```

The Ionic demo uses this configuration for its select fields.

## options

### formState

The `formState` property is passed to all fields and is a mechanism for communicating between fields (without having to mess with your model).

### resetModel and updateInitialValue

This also receives the methods `resetModel` and `updateInitialValue` which will invoke all of the field's resetModel and updateInitialValue respectively.
