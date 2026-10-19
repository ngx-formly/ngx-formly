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
| (fieldChange) | Emits a `FormlyValueChangeEvent` with `type: 'build'` when the `fields` or `form` input changes, including their initial binding. |

### Accessing controls after a build

Use `(fieldChange)` to access controls after Formly builds the form, including when fields load asynchronously:

```html
<formly-form [form]="form" [fields]="fields" [model]="model" (fieldChange)="onFieldChange($event)"></formly-form>
```

The handler receives a `FormlyValueChangeEvent`, the same event shape used by `options.fieldChanges`:

- `field` is the root field configuration containing the form's `fieldGroup`.
- `type` is `'build'`.
- `value` is the built `FormGroup` or `FormArray`, also available as `field.formControl`.

The event is delivered asynchronously after the current change-detection pass, so the handler can update parent
bindings without an `ExpressionChangedAfterItHasBeenCheckedError`. Angular waits for delivery before considering
the application stable, including during server rendering. Queued events are skipped if the form component is destroyed.
In component tests, await `fixture.whenStable()` before asserting on the handler's effects.

The form's controls, default values, validation and expressions have been initialized when the event fires:

```ts
import { FormlyValueChangeEvent } from '@ngx-formly/core';

onFieldChange({ field }: FormlyValueChangeEvent) {
  const control = field.formControl.get('firstName');
  // Subscribe to control.valueChanges or control.statusChanges here.
}
```

Replace previous subscriptions when the handler runs again and unsubscribe when the host component is destroyed. The
[JSON-powered example](https://formly.dev/examples/other/json-powered) uses Angular's `AsyncPipe` for this cleanup.

The event fires once per input update, even when both `fields` and `form` change together. It does not fire for
model-only changes, control value changes, repeat add/remove actions or direct calls to `options.build()`.
It signals that the controls are available; it does not wait for asynchronous validators or browser rendering.
The output shares the `options.fieldChanges` payload shape; it does not forward that stream or add build events to it.

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
| shareFormControl     | `boolean` | Whether fields at the same model path share a control. Defaults to `true`. Set to `false` on each mutually exclusive alternative to isolate its parsers and validators. |
| fieldGroup           | `FormlyFieldConfig[]` | A field group is a way to group fields together, making advanced layout very simple. It can also be used to group fields that are associated with the same model (useful if it's different than the model for the rest of the fields). |
| fieldArray           | `FormlyFieldConfig` | |
| fieldGroupClassName  | `string` | Specify your own class that will be applied to the `formly-group` component. |
| validation           | `object` | An object with a few useful properties: messages, show |
| validators           | `any` | Used to set validation rules for a particular field. Should be an object of key - value pairs. The value can either be an expression to evaluate or a function to run. Each should return a boolean value, returning true when the field is valid. See Validation for more information. |
| asyncValidators      | `any` | Use this one for anything that needs to validate asynchronously. Pretty much exactly the same as the validators api, except it must be a function that returns a promise. |
| formControl          | `AbstractControl` | This is the [FormControl](https://angular.io/api/forms/FormControl) for the field. It provides you more control like running validators, calculating status, and resetting state. |
| modelOptions         | `object` | An object with a few useful properties to control the model changes: `debounce`, `updateOn` |


## Alternate editors for the same model value

Fields at the same model path share a form control by default. To switch between editors with different parsers
or validators, set `shareFormControl: false` on every alternative and use mutually exclusive hide expressions:

```ts
fields: FormlyFieldConfig[] = [
  { key: 'uppercase', type: 'checkbox', props: { label: 'Use uppercase' } },
  {
    key: 'code',
    type: 'input',
    shareFormControl: false,
    resetOnHide: false,
    parsers: [(value) => value?.toLowerCase()],
    expressions: { hide: ({ model }) => !!model.uppercase },
  },
  {
    key: 'code',
    type: 'input',
    shareFormControl: false,
    resetOnHide: false,
    parsers: [(value) => value?.toUpperCase()],
    expressions: { hide: ({ model }) => !model.uppercase },
  },
];
```

Each alternative owns its control. `form.get('code')` returns the visible editor's control, whose validators
determine the form's validity. A hidden editor does not run its parsers or write to the model, including through
programmatic changes to its detached control. Hiding also cancels pending debounced model updates. When shown,
the editor reads the current model value and applies its own parsers. Keep parsers safe for the values another
editor can produce.

Set `resetOnHide: false` on all alternatives to retain the value between editors. The default remains `true`,
which clears the outgoing value and allows the next editor's default value to apply. Control state, such as
touched and dirty, belongs to each editor and is not copied between them.

This option applies to the configured field, not automatically to its descendants. Keep at most one independent
editor visible at a model path, and do not mix independent and shared controls at that path. Multiple visible
independent editors are not supported. Existing shared-control behavior is unchanged.

The [hide-fields example](https://formly.dev/examples/field-options/hide-fields) demonstrates text and numeric editors.

## HTML labels and descriptions

Set `props.allowHtml` to `true` to render `props.label` and `props.description` strings as HTML:

```ts
{
  key: 'accepted',
  type: 'checkbox',
  props: {
    label: 'Accept <strong>terms</strong>',
    description: 'Read the <a href="/terms">terms and conditions</a>.',
    allowHtml: true,
    required: true,
  },
}
```

This option defaults to `false`, so existing labels and descriptions remain plain text.
It applies to the built-in fields in Bootstrap, Material, Ionic, Kendo, PrimeNG, and NG-ZORRO.
NativeScript and custom field templates do not automatically support it.

Angular sanitizes the HTML, removing scripts and event handlers and neutralizing unsafe URLs.
The option does not bypass sanitization or change the existing `safeHtml` option for template fields.
Use ordinary HTML strings; Angular directives such as `routerLink` and Angular event bindings are not compiled.

Existing description templates in Material and NG-ZORRO continue to work. Placeholders, option labels,
validation messages, and Material's separate `hintStart` and `hintEnd` properties keep their existing behavior.

Prefer links in descriptions to interactive content inside labels. In particular,
[Angular Material advises against interactive controls inside checkbox labels](https://material.angular.dev/components/checkbox/overview#accessibility).
Keep label text descriptive so controls retain an accessible name.

See the checkbox example in each web adapter's UI demo.

## Material select trigger labels

Material select fields accept `props.triggerLabel` to customize the text displayed for the selected value.
The dropdown options still use their normal labels, and the control value stays unchanged.

- A string reads that property from the selected value. For multiple selections, it reads the property from each
  selected value and joins the labels with `, `.
- A function receives the control value, which is an array for multiple selections, and returns the display text.

```ts
{
  key: 'country',
  type: 'select',
  props: {
    triggerLabel: 'code',
    options: [{ label: 'Switzerland', value: { code: 'CH' } }],
  },
},
{
  key: 'weeks',
  type: 'select',
  props: {
    multiple: true,
    triggerLabel: (weeks: number[]) => `${weeks.length} weeks selected`,
    options: [
      { label: 'Week 1', value: 1 },
      { label: 'Week 2', value: 2 },
    ],
  },
}
```

Omit `triggerLabel` to keep Material's default selected labels. Empty selections keep the placeholder and do not
call the formatter. Labels render as text. Keep formatter functions free of side effects because Angular may call
them during each change-detection pass. The [Material demo](https://formly.dev/ui/material) includes both forms of
`triggerLabel` in its "Select with custom trigger" example.

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
