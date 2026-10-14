# Validation

## Validation summaries

Use `validationMessages` to collect every configured error message from a built field or an array of built fields.
The pipe returns an `Observable<FormlyValidationMessageEntry[]>`. Each entry contains `field`, the original field
configuration, `error`, the key in the control's errors object, and `message`, the resolved text.

Import `FormlyValidationMessagesPipe` from `@ngx-formly/core` and `AsyncPipe` from `@angular/common` in a standalone
component's `imports`. NgModule applications can use `FormlyModule` and `CommonModule` instead.

```html
<form [formGroup]="form" #formDirective="ngForm" (ngSubmit)="submit()">
  @if (formDirective.submitted) {
    @if (fields | validationMessages | async; as errors) {
      @if (errors.length) {
        <div role="alert">
          <p>Please correct the following errors:</p>
          <ul>
            @for (entry of errors; track $index) {
              <li>{{ entry.field.props?.label }}: {{ entry.message }}</li>
            }
          </ul>
        </div>
      }
    }
  }
  <formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>
  <button type="submit">Submit</button>
  <button type="button" (click)="options.resetModel(); formDirective.resetForm(form.value)">Reset</button>
</form>
```

The pipe includes errors before a field is touched or the form is submitted. The surrounding template controls when
to display them. The example above starts collecting after submission and hides the summary on reset.

Nested groups and instantiated repeated rows are visited in field order. Group-level errors are included when the
group has its own errors. Hidden fields, descendants of hidden fields, and disabled controls are excluded. Shared
controls contribute each error once, at the first visible field that resolves its message. An error forwarded with
`errorPath` is collected at its destination, not its source. Errors without a configured, nonempty message are omitted.

Messages use the same resolution rules as inline validation. From highest to lowest priority, these are the
async-validator message, validator message, `validation.messages`, the error object's `message`, and the global
message. Functions receive the error value and the field. Observable messages update as they emit; a delayed message
does not hold up messages that are already available.

Control status changes and Formly value, expression, and visibility events update the collection. Repeated-row
additions and removals update it without replacing the input array. The async pipe releases subscriptions when the
view is destroyed or its input changes. Angular operations using `emitEvent: false` remain silent until another
observed event occurs.

Supply fields after Formly has built them. For asynchronously loaded fields, establish the binding after the
[`fieldChange` build event](properties-options.md#accessing-controls-after-a-build). Null and empty inputs produce an
empty array. Replace the input reference when changing the field structure outside Formly's field APIs.

### Migrating inline messages

`FormlyValidationMessage` and `LegacyFormlyValidationMessage` are deprecated. Their selectors, getters, observables,
and existing first-error behavior remain available. UI adapters continue using them for compatibility.

For a leaf field in a custom wrapper, the pipe can display the first configured message:

```html
@if (showError) {
  {{ (field | validationMessages | async)?.[0]?.message }}
}
```

Preserve the wrapper's error ID, accessibility attributes, and visibility condition when replacing its template.
The pipe skips unmapped errors and includes descendants, so migrating a group or a field with unmapped errors can
change which message comes first. The existing component remains available for consumers that require its exact behavior.

See the [validation-message example](https://formly.dev/examples/validation/validation-message) for a working summary.

## Numeric step validation

Set `props.step` to a positive number to validate numeric values in increments of that size:

```typescript
{
  key: 'amount',
  type: 'input',
  props: { type: 'number', step: 0.01 },
  validation: {
    messages: { step: 'Enter an amount in increments of 0.01.' },
  },
}
```

With this configuration, `123.45` is valid and `123.456` produces a
`step` error containing `{ step: 0.01, base: 0, actual: 123.456 }`.
You can also register a global message named `step` through `validationMessages`.
See the [built-in validations example](https://formly.dev/examples/validation/built-in-validations).

The base is `props.min` when it is a finite number, otherwise zero. For example, `min: 0.005` and
`step: 0.01` allow `0.015`. `defaultValue` does not change the base.
Changing `props.step` or `props.min` revalidates the control.

Use `step: 'any'` or omit `step` to disable this validation. Zero, negative and nonfinite steps are ignored.
Empty values and nonnumeric values are left to other validators, such as `required`.
Only `props.step` enables the validator; setting the HTML attribute through `props.attributes.step` does not.
Fields with a named `multipleOf` validator, including JSON Schema fields, use that validator instead,
since JSON Schema multiples are relative to zero regardless of `minimum`.

## Custom Validation

Formly offers different methods to implement custom validations.

### 1. Declaring validation function and message within App Config.

#### CUSTOM VALIDATION MESSAGE
To define a custom validation message, you need to add an object with two properties: `name` and `message`. You will include this object to the validationMessages array of the `provideFormlyCore` config:

The message property could be simply a string or be defined as a function which receives the `error` and the `field` (FormlyFieldConfig) that was validated as input. The last one allows you more customization, like including the value, the  min or max value allowed, etc.

The following code example shows how to include a new message "ip" with a function to generate the string message by using the formControl.value and a new message "required" as a simple string.

```typescript
export function IpValidatorMessage(error: any, field: FormlyFieldConfig) {
  return `"${field.formControl.value}" is not a valid IP Address`;
}
...
export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore({
      validationMessages: [
        { name: 'ip', message: IpValidatorMessage },
        { name: 'required', message: 'This field is required' },
      ],
    }),
  ],
};
```

#### CUSTOM VALIDATION FUNCTION
The validation function receives the `AbstractControl` as input and it will return `null` if there is not error, and otherwise it will send an object which property is set as `true`.  The name of the property must be the same as the name set to the error message for this validation.

The following code example shows a function to validate an IP. As can be seen, the object returned when there is an error has a property called 'ip' which matches with the name of the custom validation message.

```typescript
export function IpValidator(control: AbstractControl): ValidationErrors {
  return /(\d{1,3}\.){3}\d{1,3}/.test(control.value) ? null : { 'ip': true };
}
...
export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore({
      validators: [
        { name: 'ip', validation: IpValidator },
      ],
      validationMessages: [
        { name: 'ip', message: IpValidatorMessage },
        { name: 'required', message: 'This field is required' },
      ],
    }),
  ],
};
```

#### FIELD WITH CUSTOM VALIDATION
You just need to include the name of the validate function, declared in App Config, within the property `validators.validation`.
```typescript
{
  key: 'ip',
  type: 'input',
  props: {
    label: 'IP Address (using custom validation declared in App Config)',
    required: true,
  },
  validators: {
    validation: ['ip'],
  },
},
```

:::note

If the function is async, you need to include it within `asyncValidators.validation` property:
```typescript
{
  key: 'ip',
  type: 'input',
  props: {
    label: 'IP Address (using custom validation declared in App Config)',
    required: true,
  },
  asyncValidators: {
    validation: ['ipAsync'],
  },
},
```

:::

### 2. Declaring validation function within field definition.

#### CUSTOM VALIDATION MESSAGE
[As the case above]

#### CUSTOM VALIDATION FUNCTION

You could implement the validation function within field definition. For instance, you could use this method if you want to use several validation functions with the same error message.

```typescript
export function IpValidator(control: AbstractControl): ValidationErrors {
  return /(\d{1,3}\.){3}\d{1,3}/.test(control.value) ? null : { 'ip': true };
}
```
#### FIELD WITH CUSTOM VALIDATION
You just need to include the validation function, declared wherever you want, within the property `validators.validation`.
```typescript
{
  key: 'ip',
  type: 'input',
  props: {
    label: 'IP Address (using custom validation through `validators.validation` property)',
    required: true,
  },
  validators: {
    validation: [IpValidator],
  },
},
```


:::note

If the function is async, you may need to define it in `asyncValidators.validation` property:
```typescript
{
  key: 'ip',
  type: 'input',
  props: {
    label: 'IP Address (using custom validation through `validators.validation` property)',
    required: true,
  },
  asyncValidators: {
    validation: [IpAsyncValidator],
  },
},
```

:::

### 3. Declaring validation function and message within field definition.

#### CUSTOM VALIDATION MESSAGE and CUSTOM VALIDATION FUNCTION
The validators property of a field could accept different nested properties which match with different validators.
The format would be:
```
NAME_OF_VALIDATOR: {
  expression: FUNCTION
  message: FUNCTION | STRING
}
```
#### FIELD WITH CUSTOM VALIDATION

As can be seen in the following code example, you just need to give a name to the validator property (ip), and include a function within expression property and a string or a custom message function withing message property.
```typescript
{
  key: 'ip',
  type: 'input',
  props: {
    label: 'IP Address (using custom validation through `validators.expression` property)',
    description: 'custom validation message through `validators.expression` property',
    required: true,
  },
  validators: {
    ip: {
      expression: (c: AbstractControl) => /(\d{1,3}\.){3}\d{1,3}/.test(c.value),
      message: (error: any, field: FormlyFieldConfig) => `"${field.formControl.value}" is not a valid IP Address`,
    },
  },
},
```

:::note

If the function is async, you may need to define it in `asyncValidators` property:
```typescript
{
  key: 'ip',
  type: 'input',
  props: {
    label: 'IP Address (using custom validation through `validators.expression` property)',
    description: 'custom validation message through `validators.expression` property',
    required: true,
  },
  asyncValidators: {
    ip: {
      expression: (c: AbstractControl) => return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(/(\d{1,3}\.){3}\d{1,3}/.test(c.value));
        }, 1000);
      }),
      message: (error: any, field: FormlyFieldConfig) => `"${field.formControl.value}" is not a valid IP Address`,
    },
  },
},
```
:::

### 4. Declaring validation function in a formly type and message within App Config.

#### CUSTOM VALIDATION MESSAGE
Create a custom validation message as described in point 1.

```typescript
export function IpValidatorMessage(error: any, field: FormlyFieldConfig) {
  return `"${field.formControl.value}" is not a valid IP Address`;
}
...
export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore({
      validationMessages: [
        { name: 'ip', message: IpValidatorMessage },
        { name: 'required', message: 'This field is required' },
      ],
    }),
  ],
};
```

#### CUSTOM VALIDATION FUNCTION USED ON A FORMLY TYPE
The validation function receives the `AbstractControl` as input and it will return a boolean value, `false` if there is no error, otherwise `true`.

The following code example shows a function to validate an IP. It has to return a boolean instead of a ValidationErrors object.

```typescript
export function IpValidator(control: AbstractControl): boolean {
  return /(\d{1,3}\.){3}\d{1,3}/.test(control.value);
}
...
export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore({
      validationMessages: [
        { name: 'ip', message: IpValidatorMessage },
        { name: 'required', message: 'This field is required' },
      ],
      types: [
        {
          name: 'ip',
          extends: 'input',
          defaultOptions: {
            validators: {
              ip: IpValidator // 'ip' matches the ip validation message
            }
          },
        },
    }),
  ],
};
```
#### FIELD USING A FORMLY TYPE WITH CUSTOM VALIDATION
The formly type has to be referenced in the field
```typescript
{
  key: 'ip',
  type: 'ip', // the formly type defined
  props: {
    label: 'IP Address (using custom validation declared in App Config)',
    required: true,
  },
},
```

You could try the DEMO to test the several methods to create custom validators.
- [Custom Validators](https://formly.dev/examples/validation/custom-validation)
- [Async Validators](https://formly.dev/examples/validation/unique-value-async-validation)
