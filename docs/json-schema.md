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
+     "props": { "type": "datetime-local" }
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
## if/then/else

The Formly JSON Schema service now supports conditional field rendering using the `if/then/else` keywords from JSON Schema 7.

When a schema contains `if/then` or `if/else` conditions, Formly will:

1. Parse the condition from the `if` schema (currently supports `{ "properties": { "propName": { "const": value } } }` pattern)
2. Create field groups for the properties defined in `then` and/or `else`
3. Add hide expressions to those field groups based on whether the condition is met
4. Set `resetOnHide: true` on conditional fields so they don't persist when hidden

### Example: If/Then/Else Together

You can use both `then` and `else` in the same schema to show different fields based on a condition:

```json
{
  "type": "object",
  "properties": {
    "street_address": {
      "type": "string"
    },
    "country": {
      "type": "string",
      "default": "United States of America",
      "enum": ["United States of America", "Canada", "Other"]
    }
  },
  "if": {
    "properties": {
      "country": { "const": "United States of America" }
    }
  },
  "then": {
    "properties": {
      "zipcode": { 
        "type": "string",
        "pattern": "[0-9]{5}(-[0-9]{4})?" 
      }
    }
  },
  "else": {
    "properties": {
      "postal_code": { 
        "type": "string",
        "pattern": "[A-Z][0-9][A-Z] [0-9][A-Z][0-9]" 
      }
    }
  }
}
```

In this example:
- When `country` is `"United States of America"`, the `zipcode` field is visible
- When `country` is anything else (`"Canada"` or `"Other"`), the `postal_code` field is visible
- Only one field will be visible at a time
- Both fields will be reset when they become hidden
