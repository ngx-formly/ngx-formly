# Validation

## Custom Validation
Formly offers different methods to implement custom validations.

#### 1. Declaring validation function and message within NgModule declaration.

##### CUSTOM VALIDATION MESSAGE
To define a custom validation message, you need to add an object with two properties: `name` and `message`. You will include this object to the validationMessages array of the FormlyModule config:

The message property could be simply a string or be defined as a function which receives the `error` and the `field` (FormlyFieldConfig) that was validated as input. The last one allows you more customization, like including the value, the  min or max value allowed, etc.

The following code example shows how to include a new message "ip" with a function to generate the string message by using the formControl.value and a new message "required" as a simple string.

```typescript
export function IpValidatorMessage(error: any, field: FormlyFieldConfig) {
  return `"${field.formControl.value}" is not a valid IP Address`;
}
...
@NgModule({
  imports: [
    ...
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'ip', message: IpValidatorMessage },
        { name: 'required', message: 'This field is required' },
      ],
    }),
  ]
})
```

##### CUSTOM VALIDATION FUNCTION
The validation function receives the `AbstractControl` as input and it will return `null` if there is not error, and otherwise it will send an object which property is set as `true`.  The name of the property must be the same as the name set to the error message for this validation.

The following code example shows a function to validate an IP. As can be seen, the object returned when there is an error has a property called 'ip' which matches with the name of the custom validation message.

```typescript
export function IpValidator(control: AbstractControl): ValidationErrors {
  return /(\d{1,3}\.){3}\d{1,3}/.test(control.value) ? null : { 'ip': true };
}
...
@NgModule({
  imports: [
    ...
    FormlyModule.forRoot({
      validators: [
        { name: 'ip', validation: IpValidator },
      ],
      validationMessages: [
        { name: 'ip', message: IpValidatorMessage },
        { name: 'required', message: 'This field is required' },
      ],
    }),
  ]
})
```

##### FIELD WITH CUSTOM VALIDATION
You just need to include the name of the validate function, declared in `FormlyModule`, within the property `validators.validation`.
```typescript
{
  key: 'ip',
  type: 'input',
  props: {
    label: 'IP Address (using custom validation declared in ngModule)',
    required: true,
  },
  validators: {
    validation: ['ip'],
  },
},
```

**ALERT!** If the function is async, you need to include it within `asyncValidators.validation` property:
```typescript
{
  key: 'ip',
  type: 'input',
  props: {
    label: 'IP Address (using custom validation declared in ngModule)',
    required: true,
  },
  asyncValidators: {
    validation: ['ipAsync'],
  },
},
```

#### 2. Declaring validation function within field definition.

##### CUSTOM VALIDATION MESSAGE
[As the case above]

##### CUSTOM VALIDATION FUNCTION

You could implement the validation function within field definition. For instance, you could use this method if you want to use several validation functions with the same error message.

```typescript
export function IpValidator(control: AbstractControl): ValidationErrors {
  return /(\d{1,3}\.){3}\d{1,3}/.test(control.value) ? null : { 'ip': true };
}
```
##### FIELD WITH CUSTOM VALIDATION
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


**ALERT!** If the function is async, you may need to define it in `asyncValidators.validation` property:
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

#### 3. Declaring validation function and message within field definition.

##### CUSTOM VALIDATION MESSAGE and CUSTOM VALIDATION FUNCTION
The validators property of a field could accept different nested properties which match with different validators.
The format would be:
```
NAME_OF_VALIDATOR: {
  expression: FUNCTION
  message: FUNCTION | STRING
}
```
##### FIELD WITH CUSTOM VALIDATION

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

**ALERT!** If the function is async, you may need to define it in `asyncValidators` property:
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


#### 4. Declaring validation function in a formly type and message within NgModule declaration.

##### CUSTOM VALIDATION MESSAGE
Create a custom validation message as described in point 1.

```typescript
export function IpValidatorMessage(error: any, field: FormlyFieldConfig) {
  return `"${field.formControl.value}" is not a valid IP Address`;
}
...
@NgModule({
  imports: [
    ...
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'ip', message: IpValidatorMessage },
        { name: 'required', message: 'This field is required' },
      ],
    }),
  ]
})
```

##### CUSTOM VALIDATION FUNCTION USED ON A FORMLY TYPE
The validation function receives the `AbstractControl` as input and it will return a boolean value, `false` if there is no error, otherwise `true`.

The following code example shows a function to validate an IP. It has to return a boolean instead of a ValidationErrors object.

```typescript
export function IpValidator(control: AbstractControl): boolean {
  return /(\d{1,3}\.){3}\d{1,3}/.test(control.value);
}
...
@NgModule({
  imports: [
    ...
    FormlyModule.forRoot({
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
  ]
})
```
##### FIELD USING A FORMLY TYPE WITH CUSTOM VALIDATION
The formly type has to be referenced in the field
```typescript
{
  key: 'ip',
  type: 'ip', // the formly type defined
  props: {
    label: 'IP Address (using custom validation declared in ngModule)',
    required: true,
  },
},
```

You could try the DEMO to test the several methods to create custom validators.
- [Custom Validators](https://formly.dev/examples/validation/custom-validation)
- [Async Validators](https://formly.dev/examples/validation/unique-value-async-validation)
