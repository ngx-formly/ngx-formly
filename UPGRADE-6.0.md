UPGRADE FROM 5.0 to 6.0
=======================
- **BREAKING CHANGE**: Formly v6 now requires Angular Version >= 11

@ngx-formly/core
----------------
- **BREAKING CHANGE**: The defaultValue for fieldGroup and fieldArray has been changed to `undefined` instead of empty object. ([#1901](https://github.com/ngx-formly/ngx-formly/pull/1901)

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

- **BREAKING CHANGE**: The initial value of the created FormControl has been changed from `null` to `undefined` to match the field model value. ([#1917](https://github.com/ngx-formly/ngx-formly/pull/1917))
  
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

- **BREAKING CHANGE**: The `lazyRender` option is enabled by default, which remove the hidden fields from the DOM instead of using CSS to control their visibility. To rely on the old behavior you need to pass `false` to `lazyRender`:

  ```patch
  FormlyModule.forRoot({
  + extras: {
  +   lazyRender: false,
  + },
  }),
  ```

- **BREAKING CHANGE**: The `resetFieldOnHide` option is enabled by default, which remove the field value from the model on hide.

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
