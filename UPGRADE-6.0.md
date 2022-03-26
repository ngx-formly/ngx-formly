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


- The defaultValue for fieldGroup and fieldArray has been changed to `undefined` instead of empty object. If you want to rely on the old behavior set the `defaultValue`:

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

- The initial value of the created FormControl has been changed from `null` to `undefined` to match the field model value.
  
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

- Add support of strict template checking:

  In case `strictTemplates` is enabled after the upgrade, add `FieldTypeConfig` to all custom field type that use `[formControl]` input which expect the `formControl` property to be an instance of `FormControl`.
 
  ```patch
  - import { FieldType } from '@ngx-formly/core';
  + import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

  @Component({
    template: `<input [formControl]="formControl" />`,
  })
  - export class CustomFieldType extends FieldType {}
  + export class CustomFieldType extends FieldType<FieldTypeConfig> {}
  ```

- The message validation key: `maxlength` and `maxlength` has been changed from lowercase into snakecase format in order to match the same key of `templateOptions.minLength` and `templateOptions.maxLength`:
  - NgModule declaration:
  ```patch
  FormlyModule.forRoot({
    validationMessages: [
  -   { name: 'minlength', message: minlengthValidationMessage },
  +   { name: 'minLength', message: minLengthValidationMessage },

  -   { name: 'maxlength', message: maxlengthValidationMessage },
  +   { name: 'maxLength', message: maxLengthValidationMessage },
    ],
  })
  ```

  - Field Config declaration (if using `validation.messages`):
  ```patch
  fields: FormlyFieldConfig[] = [
    {
      key: 'password',
      type: 'input',
      templateOptions: {
        label: 'Password',
        minLength: 6,
        maxLength: 20,
      },
      validation: {
        messages: {
  -       minLength: 'minLength custom message',
  +       minLength: 'minLength custom message',

  -       maxLength: 'maxLength custom message',
  +       maxLength: 'maxLength custom message',
        },
      },
    },
  ```

  - Reset form value: In case you rely on `form.reset()` instead of `options.resetModel()`, please note that if you call `reset` without an explicit value, its value reverts to its default value instead of `null`. 

@ngx-formly/core/json-schema
----------------------------

- In case you use the extra option `map` to customize the generated field, you need to make change to take account of following properties:
  1. `fieldArray` which return `function` instead of an object.
  2. `templateOptions` which has been replaced by `props`.
  3. `hideExpression` which has been replaced by `expressions: { hide: ... }`.
  4. `expressionProperties` which has been replaced by `expressions`.

```ts
this.formlyJsonschema.toFieldConfig(schema, {
  map: (field: FormlyFieldConfig, schema: JSONSchema7) => {
    ... // update `fieldArray` value

    return field;
  },
});
```

- The `null` validation message has been removed and replaced by `type` validation message:

```patch
+ export function typeValidationMessage({ schemaType }) {
+  return `should be "${schemaType[0]}".`;
+ }

@NgModule({
  imports: [
    FormlyModule.forRoot({
      validationMessages: [
-       { name: 'null', message: 'should be null' },
+       { name: 'type', message: typeValidationMessage },
      ],
    }),
  ],
})
export class AppModule {}
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



@ngx-formly/ionic
-----------------

- The library now require the Ionic V6, To upgrade your Ionic 5 apps to Ionic 6 check [Ionic guide](https://ionicframework.com/docs/intro/upgrading-to-ionic-6)

- `datetime`: due to the breaking changes introduced in `ion-datetime` component as described here https://ionicframework.com/docs/intro/upgrading-to-ionic-6#datetime, the following properies: `pickerOptions`, `pickerFormat`, `monthNames`, `monthShortNames`, `dayNames` and `dayShortNames` has been removed.
  
  To customize `datetime` presentation and format, use the following properties:

  | property      | default   | |
  | ------------- | -------   | -------- |
  | presentation  | `date`    | https://ionicframework.com/docs/api/datetime#presentation |
  | locale        | `default` | https://ionicframework.com/docs/api/datetime#locale | 
  | displayFormat | `null`    | use the [Date pipe](https://angular.io/api/common/DatePipe#pre-defined-format-options) format |
