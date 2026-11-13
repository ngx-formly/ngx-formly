# WebMCP

WebMCP lets browser AI agents discover and call a page's tools. Formly can describe a running form, fill its fields, and report validation results. Users see the changes in the ordinary form.

This integration is experimental. The [WebMCP browser API](https://webmachinelearning.github.io/webmcp/) can still change. It is separate from Formly's [server MCP tools](https://formly.dev/guide/mcp), which help developers find documentation and validate configurations.

## Choose which fields participate

By default, fields do not participate. Opt in a field with `webMcp: true`:

```ts
fields: FormlyFieldConfig[] = [
  { key: 'name', type: 'input', webMcp: true, props: { label: 'Name' } },
  { key: 'internalReference', type: 'input' },
];
```

To include fields by default, use the library configuration:

```ts
provideFormlyCore({ extras: { webMcp: true } });
// NgModule applications can use FormlyModule.forRoot({ extras: { webMcp: true } }).
```

Then exclude individual fields or groups with `webMcp: false`. The nearest explicit setting wins: the field, its enclosing groups, then the library default. A child can opt back into an excluded group:

```ts
{
  key: 'profile',
  webMcp: false,
  fieldGroup: [
    { key: 'displayName', type: 'input', webMcp: true },
    { key: 'internalReference', type: 'input' },
  ],
}
```

Library-level `false` means excluded by default; it does not block explicit field opt-ins. Global opt-in also includes newly added fields. Exclude private fields explicitly. Excluding one visible editor excludes other visible editors of the same model value, even when they opt in.

No additional provider or import is required. Formly loads the implementation on demand. It registers nothing during server rendering or on platforms without the browser API.

## Name a form and optionally allow submission

Formly generates a unique name for each mounted form. Supply a short, descriptive name when agents need to distinguish forms:

```ts
options: FormlyFormOptions = {
  webMcp: {
    name: 'signup',
    description: 'Register a new account.',
  },
};
```

The form registers `fill_signup` when it has participating fields. Naming a form does not opt its fields in. Names must be unique on the page; the complete tool name accepts up to 128 ASCII letters, digits, underscores, dots, and hyphens.

Submission requires an explicit callback:

```ts
options: FormlyFormOptions = {
  webMcp: {
    name: 'signup',
    description: 'Register a new account.',
    submit: async (model, signal) => {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model),
        signal,
      });
      if (!response.ok) throw new Error('Registration failed');
    },
  },
};
```

This registers `submit_signup`. It fills any supplied fields, waits for validation, and calls the callback only when the complete form is valid. The callback receives a snapshot of the full model, including fields excluded from agent access. Formly does not also trigger `ngSubmit` or submit the HTML form.

Await the application's submission work inside this callback. Callback return values and exception details are not returned to agents. Set errors on the existing controls to report server-side validation failures. Cancellation supplies an abort signal but cannot undo an operation already accepted by the server.

## Fill and inspect

`fill_signup` accepts any subset of its advertised fields. Nested objects merge. A call with `{}` reports field metadata, missing required values, and validation without changing the form or returning existing values.

Responses contain field paths, labels, required/empty state, supported write access, validation messages, and the values changed by that call. They do not contain the full model. Password values and password validation message text are withheld. Custom validation messages for other fields are application-authored content; do not include private values in them.

Hidden, disabled, and read-only fields cannot be written. Excluded fields do not appear in responses. Select choices use the configured option mappings and exclude disabled options. Existing disabled selections are preserved when updating multiselects and multicheckbox maps.

Malformed requests are rejected before writing. Accepted values pass through Formly's existing controls, parsers, model updates, expressions, and validators. If an earlier change hides or disables a later target, filling stops and reports the changes already applied. Normal validation failures keep the entered values available for correction.

Calls wait up to five seconds for model debounce and asynchronous validators. A pending result means the agent must wait or the user must finish the form; submission has not run. Concurrent calls return `busy`. Tools follow field rebuilds, option changes, and expressions. Use `options.build()` after changing field structure directly.

## Repeated sections and custom fields

Agents edit existing repeat rows using index-keyed objects:

```json
{ "people": { "1": { "name": "Ada" } } }
```

This updates the second row's name while preserving its other values and controls. Agents cannot add, remove, or reorder rows. Users can still use the normal repeat controls, after which Formly refreshes the tool schema. Multiselect controls continue to accept ordinary arrays of selected values.

Standard text, numeric, boolean, and selection controls are supported. Custom controls participate when their JSON value shape can be inferred from their current value. Files, `Date` objects, class instances, and custom controls without an inferable shape report `unsupported`; Formly does not guess a serialization. Exclude such fields if they should not appear in reports.

## Try it

Use the [WebMCP example](https://formly.dev/examples/advanced/web-mcp). It demonstrates both library defaults, field and group overrides, password redaction, repeat rows, and optional submission.

Follow [Chrome's WebMCP setup instructions](https://developer.chrome.com/docs/ai/webmcp) for the origin trial or local testing flag, then inspect the page using a compatible agent or the [Model Context Tool Inspector](https://github.com/beaufortfrancois/model-context-tool-inspector). Ordinary browsers still render the form normally. Duplicate names, browser permission failures, and registration failures are reported in the console.
