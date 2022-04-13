# Formly Expressions

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


**ALERT**: You can use the `formState` to store information. In the example we keep the model. `formState` is a property of options. [Read more](https://formly.dev/examples/form-options/form-state)

```typescript
options = {
  formState: {
    mainModel: this.model,
  },
};
```

## Conditional Rendering

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

TS
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
