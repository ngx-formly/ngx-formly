# JSON Schema

## How to use:

In order to use JSON Schema, Formly provide `FormlyJsonschema` service that let you convert JSON Schema to Formly Field Config.

### Usage

1. import `FormlyJsonschema` service

```ts
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';

export class AppComponent {
  ...

  constructor(private formlyJsonschema: FormlyJsonschema) {}
}
```

2. pass `schema` to `FormlyJsonschema::toFieldConfig` function

```ts
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';

export class AppComponent {
  ...
  fields: FormlyFieldConfig[] = [this.formlyJsonschema.toFieldConfig(schema)];
}
```

## Demo

See [JSON Schema Examples](https://formly.dev/docs/examples/advanced/json-schema).

## Customize JSON Schema output

To adjust the generated `FormlyFieldConfig` use one of the following options:

1. pass the extra Formly config through `widget` property:


```patch
{
  "type": "string",
  "format": "date-time",
+ "widget": {
+   "formlyConfig": {
+     "templateOptions": { "type": "datetime-local" }
+   }
+ }
}
```

2. use a `map` option:

```patch
this.formlyJsonschema.toFieldConfig(
  schema,
+  {
+    map: (field: FormlyFieldConfig, schema: JSONSchema7) => {
+      if (schema.order) {
+        ...
+      }
+
+      return field;
+    },
+  },
);
```
