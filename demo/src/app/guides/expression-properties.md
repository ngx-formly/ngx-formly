# Formly Expressions

You can use `hideExpression` to hide fields dynamically and `expressionProperties` allow you to dynamically change many properties of a field.

## Expression Properties

Expression Properties allows you to dynamically change many properties of a field.
For example, you can disable a form field dynamically. The value of this property can be `string` or `function`.
You can see an example using string value [here](https://stackblitz.com/edit/angular-formly-eehxjb?file=app/app.component.ts)

```typescript
{
  key: 'text2',
  type: 'input',
  templateOptions: {
    label: 'Hey!',
    placeholder: 'This one is disabled if there is no text in the other input',
  },
  expressionProperties: {
    'templateOptions.disabled': '!model.text',
  },
},
```
The field will be hidden when *model.text* is empty

Example with function value:

```typescript
{
  key: 'country',
  type: 'input',
  templateOptions: {
    label: 'field 2',
    placeholder: ''
  },
  expressionProperties: {
    'templateOptions.disabled': (model: any, formState: any, field: FormlyFieldConfig) => {
      // access to the main model can be through `this.model` or `formState` or `model`
      return !formState.mainModel.text
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

The `hideExpression` property is used to set the hide property of your field. The value of this property can be `string`, `function` or `boolean`. Below is an example of each of them.

First option with *string value*:

You can see an example [here](https://stackblitz.com/edit/angular-formly-f79kb3?file=app/app.component.ts)
```typescript
{
  key: 'iLikeTwix',
  type: 'checkbox',
  templateOptions: {
    label: 'I like twix',
  },
  hideExpression: '!model.name',
}
```
Second option with *function value*:

You can see an example [here](https://stackblitz.com/edit/angular-formly-ndfcmz?file=app/app.component.ts)

```typescript
{
  key: 'country',
  type: 'input',
  templateOptions: {
    label: 'City',
    placeholder: 'set to 123'
  },
  hideExpression: (model: any, formState: any, field: FormlyFieldConfig) => {
    // access to the main model can be through `this.model` or `formState` or `model`
    if (formState.mainModel && formState.mainModel.city) {
      return formState.mainModel.city !== "123"
    }
    return true;
  },
},
```

Third option with boolean.  You can see an example [here](https://stackblitz.com/edit/angular-formly-dpyzb9?file=app/app.component.ts)

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
    templateOptions: {
      label: 'Street',
      placeholder: ''
    },
    hideExpression: this.show
  },
];

toggle(){
  this.show = !this.show;
  this.fields[1].hideExpression = this.show;
}
```
