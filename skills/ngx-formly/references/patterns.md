# Formly implementation patterns

Use the sections needed by the task. Check each API against the installed version before adapting an example.

## Custom types and wrappers

Reuse an adapter type when only its defaults change. A named type with `extends: 'input'` and `defaultOptions` can provide a reusable configuration without a new component.

For a new control template, extend `FieldType<FieldTypeConfig>`. In a standalone component, import `ReactiveFormsModule` and `FormlyAttributes` and bind the actual input to `[formControl]="formControl"` and `[formlyAttributes]="field"`. NgModule applications provide those directives through their modules. A custom Angular control must expose a working `ControlValueAccessor` for the form-control binding.

Register the component through `types: [{ name: 'rating', component: RatingFieldType }]` in the existing Formly configuration. Then use `type: 'rating'` in fields. Add a wrapper that supplies the label, description, and validation messages, or render those in the type. Preserve IDs, label associations, and error accessibility attributes.

A wrapper extends `FieldWrapper` and provides `<ng-container #fieldComponent></ng-container>` as the field insertion point. Register it through `wrappers: [{ name: 'panel', component: PanelWrapper }]`, then assign `wrappers: ['panel']` to a field or type definition. Reuse the adapter's `form-field` wrapper when appropriate.

Sources: [custom types](https://formly.dev/guide/custom-formly-field), [wrappers](https://formly.dev/guide/custom-formly-wrapper).

## Repeated sections

Use a registered component extending `FieldArrayType`. Its template renders each entry in `field.fieldGroup` with `<formly-field [field]="field"></formly-field>` and calls the inherited `add()` and `remove(index)` methods. Import `FormlyField` for a standalone component or `FormlyModule` for module-based code. Add and remove buttons inside a form need `type="button"`.

`repeat` is an example name, not a core built-in type. Once registered, a repeated object configuration can be:

```ts
{
  key: 'contacts',
  type: 'repeat',
  fieldArray: {
    fieldGroup: [
      { key: 'name', type: 'input', props: { label: 'Name', required: true } },
    ],
  },
}
```

The model is `{ contacts: [{ name: 'Ada' }] }`. Let `FieldArrayType` coordinate model rows, controls, and field keys through its methods. If overriding lifecycle or array methods, retain the base behavior. Test inserting and removing a middle row with existing values and validation state. Row identity behavior varies by release; consult the migration guide before assuming touched/dirty state follows either the item or its index.

Source: [repeating section example](https://formly.dev/examples/advanced/repeating-section).

## Validation

Use `props.required`, `props.minLength`, `props.maxLength`, `props.min`, `props.max`, and `props.pattern` for supported built-in constraints. Match error message names to the actual error keys; Formly's built-in length message keys are `minLength` and `maxLength`.

The two custom validator contracts differ:

- An Angular validator in `validators.validation` returns `null` for valid input or a `ValidationErrors` object for invalid input. A globally registered validator can be referenced by name in that array.
- A named Formly validator's `expression` returns `true` for valid input and `false` for invalid input. Its `message` corresponds to that validator name.

```ts
import { AbstractControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

export const quantityField: FormlyFieldConfig = {
  key: 'quantity',
  type: 'input',
  props: { type: 'number', label: 'Quantity' },
  validators: {
    even: {
      expression: (control: AbstractControl) => control.value == null || control.value % 2 === 0,
      message: 'Enter an even quantity.',
    },
  },
};
```

Leave empty values to `required` unless the requirement says otherwise. Read the current value from `control.value`; validators may run before Formly updates the model.

Use `asyncValidators` for asynchronous rules with the corresponding return contract in a Promise or Observable. Ensure observable validation completes, and handle request failures according to the application's policy so a field does not remain pending or silently accept a failed check.

Put cross-field validation on the common group so changes to either child rerun it. Use `errorPath` when supported to display a group error on a child. An individual control does not automatically revalidate when external state changes; call `updateValueAndValidity()` where that dependency changes.

Configure messages through field `validation.messages`, a named validator's `message`, or global `validationMessages`. Reuse the adapter's error display. Check installed exports before using newer summary pipes or multiple-error display options.

Source: [validation](https://formly.dev/guide/validation).

## Select options and dependent fields

Adapter selects commonly accept `{ label, value }[]` or an observable through `props.options`. Check the adapter's supported `labelProp`, `valueProp`, grouping, and comparison options when using application data. Keep option value types consistent with the model.

For a dependent select, observe the parent control after Formly builds it, include its initial value, and use `switchMap` for remote requests so stale responses do not replace newer options. Decide whether the child value should clear or remain when the parent changes. Avoid fetching options inside expressions.

Release subscriptions with the field's lifecycle. Where supported, returning the observable from `hooks.onInit` lets Formly manage its subscription; otherwise pair explicit subscriptions with `hooks.onDestroy`. A component's destroy hook alone is insufficient when a dynamic field is removed before the host component.

Sources: [cascaded select example](https://formly.dev/examples/other/cascaded-select), [field options](https://formly.dev/guide/properties-options).

## JSON Schema

Import `FormlyJsonschema` from `@ngx-formly/core/json-schema`, then set `fields = [formlyJsonschema.toFieldConfig(schema)]`. JSON Schema describes data; it is distinct from a serialized array of `FormlyFieldConfig` objects.

The converter generates field types that the application must register. Start from the version-matched JSON Schema example and inspect its providers and custom object, array, and union types. Do not assume a UI adapter registers every generated type.

Customize conversion through `toFieldConfig(schema, { map: (field, schema) => field })` or trusted schema `widget.formlyConfig` metadata rather than maintaining another converter. Check support for the requested schema keywords and dialect; conversion is not a substitute for server-side validation.

Test explicit defaults, existing values, required properties, nullable values, and branch switching where relevant. Options controlling implicit defaults and support for conditional keywords vary by release. Preserve the backend's distinction between missing properties, empty strings, and `null`.

Sources: [JSON Schema guide](https://formly.dev/guide/json-schema), [complete example](https://formly.dev/examples/advanced/json-schema).
