# JSON Schema

## How to use:

TBD

## Demo

see https://formly.dev/docs/examples/advanced/json-schema

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
