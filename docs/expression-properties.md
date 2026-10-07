# Formly Expressions

## 1. Dynamically Change field properties

Expressions allow you to dynamically change field properties.
For example, you can disable a form field dynamically. The value of this property can be `string` or `function`.
You can see an example using string value [here](https://stackblitz.com/edit/angular-formly-eehxjb?file=app/app.component.ts)

```typescript
{
  key: 'text2',
  type: 'input',
  props: {
    label: 'Hey!',
    placeholder: 'This one is disabled if there is no text in the other input',
  },
  expressions: {
    'props.disabled': '!model.text',
  },
},
```
The field will be hidden when *model.text* is empty

Example with function value:

```typescript
{
  key: 'country',
  type: 'input',
  props: {
    label: 'field 2',
    placeholder: ''
  },
  expressions: {
    'props.disabled': (field: FormlyFieldConfig) => {
      return !field.model.text;
    },
  }
}
```

The field will be hidden when *formState.mainModel.text* is empty

:::note

You can use the `formState` to store information. In the example we keep the model. `formState` is a property of options. [Read more](https://formly.dev/examples/form-options/form-state)

```typescript
options = {
  formState: {
    mainModel: this.model,
  },
};
```

:::

## 2. Conditional Rendering

The `hide` property is used to set the hide property of your field. The value of this property can be a `boolean`. To make this property conditional we'll use `expressions: { hide: ... }` where the value can  `string`, `function` or `boolean`. Below is an example of each of them.

First option with *string value*:

You can see an example [here](https://stackblitz.com/edit/angular-formly-f79kb3?file=app/app.component.ts)
```typescript
{
  key: 'iLikeTwix',
  type: 'checkbox',
  props: {
    label: 'I like twix',
  },
  expressions: { hide: '!model.name' },
}
```
Second option with *function value*:

You can see an example [here](https://stackblitz.com/edit/angular-formly-ndfcmz?file=app/app.component.ts)

```typescript
{
  key: 'country',
  type: 'input',
  props: {
    label: 'Country',
    placeholder: 'set city field to 123'
  },
  expressions: {
    hide: (field: FormlyFieldConfig) => {
      return field.model?.city === "123";
    },
  }
},
```

Third option with boolean. You can see an example [here](https://stackblitz.com/edit/angular-formly-dpyzb9?file=app/app.component.ts)

HTML
```html
<button (click)="toggle()">Click me</button>
```

```typescript
fields: FormlyFieldConfig[] = [
  {
    key: 'country',
    type: 'input',
    props: {
      label: 'Street',
      placeholder: ''
    },
  },
];

toggle(){
  this.fields[0].hide = !this.fields[0].hide;
}
```

:::note

By default, the model's value is cleared when the field becomes hidden. If you want to preserve the value of a hidden field, use one of the following solution: 

To preserve for a specific field pass `false` to `resetOnHide`:
```patch
let fields: FormlyFieldConfig[] = [
  {
    key: 'text',
    type: 'input',
+   resetOnHide: false
  }
]
```

To preserve for all fields pass `false` to `resetFieldOnHide`:
```patch
provideFormlyCore({
+ extras: {
+   resetFieldOnHide: false,
+ },
})
```

:::

### Circular hide expressions

Hiding a field can clear its value, and showing it can restore its `defaultValue`. Avoid hide expressions that repeatedly toggle because of these changes. For example, a field with `defaultValue: 'Yes'` and `hide: "model.enabled && model.x === 'Yes'"` will alternate between hidden and visible when its key is `x` and `model.enabled` becomes `true`.

Formly limits the number of passes used to process visibility changes. The internal limit is `Math.max(100, 2 * fieldCount)`, where `fieldCount` includes the root, nested groups, and instantiated array items at the start of the check. Fields added during the check do not increase its limit. This is a safety limit; exceeding it does not prove that the expressions contain a cycle.

When the limit is reached with visibility changes still pending, Formly logs this warning and throws an error that includes the pass count:

```text
[Formly] The form may be inconsistent. Check for circular hide expressions
```

After a runtime failure, correct the expression and explicitly call `options.checkExpressions` with the root field to retry. Pending visibility changes are retained, but previously cleared values and emitted events are not rolled back. If the error occurred during initial form construction, correct the configuration and rebuild the form. The guard limits repeated checks; it cannot interrupt an expression function that never returns.

## 3. Get notified about an expression changes


Formly provide a way to get notified about the field changes through `options.fieldChanges` property which includes evaluted expressions. In order to get notified for a specific expression changes, subscribe to `options.fieldChanges` and check the emitted event.

The emitted event object include the following info:

| Property | Description                    |
| -------- | ------------------------------ |
| field    | The field instance             |
| type     | Event type, for expression changes it should be equal to `expressionChanges` |
| property | The evaluated expression key   |
| value    | The evaluated expression value |

Example ([Demo](https://stackblitz.com/edit/angular-yobrug?file=src/app/app.component.ts)): The following example print a console log when a the `city` field is rendered:

```typescript
{
  key: 'city',
  type: 'input',
  expressions: {
    hide: (field: FormlyFieldConfig) => {
      // city field is rendered only when `country` is set
      return !(field.model?.country);
    },
  },
  hooks: {
    onInit: (field) => {
      return field.options.fieldChanges.pipe(
        filter(e => {
          return e.type === 'expressionChanges'
            && e.field === field
            && e.property === 'hide'
            && e.value === false
        }),
        tap(e => console.warn('City field is shown', e)),
      )
    }
  }
},
```

## 4. Expression Evaluation

By default, Formly evaluates string expressions using `new Function()`. For better performance and to support environments with a strict Content Security Policy (CSP), it is recommended to use `withFormlyFieldExpression()` in the Formly configuration:

```patch
provideFormlyCore(
+ withFormlyFieldExpression(),
)
```

The `withFormlyFieldExpression()` implementation parses and evaluates expressions without using `eval()` or `new Function()`.
