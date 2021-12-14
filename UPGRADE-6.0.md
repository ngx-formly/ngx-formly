UPGRADE FROM 5.0 to 6.0
=======================
- Formly V6 now requires Angular Version >= 13

@ngx-formly/core
----------------
- All Formly components now use `OnPush` change detection, so in order to let Angular detect changes of `templateOptions` properties either ensure a default value is set or use spread object assign instead of regular assign:

  ### Solution 1: set a default value

  ```patch
  export class CustomFieldType extends FieldType {
    defaultOptions = {
      templateOptions: {
  +     loading: false,
      },
    };

    showLoader() {
      field.templateOptions.loading = true
    }
  }
  ```

  ### Solution 2: use spread object assign

  ```patch
    showLoader() {
  -   field.templateOptions.loading = true
  +   field.templateOptions = {
  +     ...field.templateOptions,
  +     loading: true
  +   };
    }
  ```

  - **Note**:
    The above changes concern only the extra properties defined in your custom type and not the provided ones from Formly such as `disabled`, `label` ...

    ```ts
    // still working in `V6`
    field.templateOptions.disabled = true;
    ```


- The defaultValue for fieldGroup and fieldArray has been changed to `undefined` instead of empty object. ([#1901](https://github.com/ngx-formly/ngx-formly/pull/1901), if you want to rely on the old behavior set the `defaultValue`:

  **before**:  
  If no default value is set the `defaultValue` for formlyGroup is `{}` and for fieldArray `[]`
  
  **after**:  
  ```ts
  FormlyModule.forRoot({
    types: [
      {
        extends: 'formly-group',
        defaultOptions: {
          defaultValue: {}
        }
      }
    ],
  })
  ```

- The initial value of the created FormControl has been changed from `null` to `undefined` to match the field model value. ([#1917](https://github.com/ngx-formly/ngx-formly/pull/1917))
  
  **before**:  
  ```ts
  let fields: FormlyFieldConfig[] = [
    {
      key: 'text',
      type: 'input'
    }
  ]
  ```
  
  **after**:  
  ```ts
  let fields: FormlyFieldConfig[] = [
    {
      key: 'text',
      type: 'input',
      defaultValue: null
    }
  ]
  ```

- The `checkExpressionOn` option is set to `modelChange` by default, which improve performance. To rely on the old behavior you need to pass `changeDetectionCheck` to `checkExpressionOn`:

  ```patch
  FormlyModule.forRoot({
  + extras: {
  +   checkExpressionOn: 'changeDetectionCheck',
  + },
  }),
  ```

- The `lazyRender` option is enabled by default, which remove the hidden fields from the DOM instead of using CSS to control their visibility. To rely on the old behavior you need to pass `false` to `lazyRender`:

  ```patch
  FormlyModule.forRoot({
  + extras: {
  +   lazyRender: false,
  + },
  }),
  ```

- The `resetFieldOnHide` option is enabled by default, which remove the field value from the model on hide.

  To disable this feature for a specific field use `resetOnHide`:
  ```patch
  let fields: FormlyFieldConfig[] = [
    {
      key: 'text',
      type: 'input',
  +   resetOnHide: false
    }
  ]
  ```

  To use the the old behavior pass `false` to `resetFieldOnHide`:
  ```patch
  FormlyModule.forRoot({
  + extras: {
  +   resetFieldOnHide: false,
  + },
  }),
  ```

@ngx-formly/bootstrap
---------------------
- Bootstrap v4 support is removed and replaced with v5 support. To upgrade check the migration documentation [https://getbootstrap.com/docs/5.0/migration/](https://getbootstrap.com/docs/5.0/migration/)

- `formCheck`: `custom` prefix has been removed and replaced by the following values:

  | Before        | After    |
  | ------------- | -------- |
  | custom        | default  |
  | custom-inline | inline   |
  | custom-switch | switch   |

- add-on: The two first argument of `onClick` handler has been replaced by `field` instance.

  ```patch
  - onClick: (to, fieldType, $event) => ...,
  + onClick: (field, $event) => ...,
  ```

@ngx-formly/json-schema
-----------------------

- In case you use the extra option `map` to customize the generated `fieldArray`, you need to make change to take account of `fieldArray` which return `function` instead of an object.

```ts
this.formlyJsonschema.toFieldConfig(schema, {
  map: (field: FormlyFieldConfig, schema: JSONSchema7) => {
    ... // update `fieldArray` value

    return field;
  },
});
```
