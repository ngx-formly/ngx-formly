---
name: ngx-formly
description: Build and troubleshoot dynamic Angular forms with ngx-formly in consuming applications. Use for Formly setup, field configuration, validation, conditional fields, custom types and wrappers, repeated sections, JSON Schema, or Formly upgrades.
license: MIT
---

# ngx-formly

Implement the requested form in the consuming application's existing Angular architecture and UI library.

## Establish the project's setup

Before choosing APIs, inspect the application's `package.json`, lockfile, installed package declarations, and nearby forms. Identify:

- The resolved Angular, `@ngx-formly/core`, UI adapter, and UI library versions. For a new installation, check the chosen packages' peer dependencies and use the project's package manager.
- Standalone or NgModule registration, including lazy feature providers.
- Existing field types, wrappers, validators, and shared configuration that the form can reuse.
- The model shape and submission contract, including whether hidden or disabled values should be submitted.

Keep the installed Formly major unless an upgrade is requested or necessary for the requested feature. Update core and adapters together when upgrading. Follow the matching migration guides and check UI peer dependencies as well as Angular compatibility.

Formly uses Angular Reactive Forms. Keep its `FormGroup` and control bindings even in applications that use signals elsewhere. Signal expressions, when supported by the installed version, do not make the form an Angular Signal Form.

For installation, provider registration, or a first form, read [setup.md](references/setup.md). For custom types, wrappers, arrays, validation, dependent selects, or JSON Schema, read the relevant section of [patterns.md](references/patterns.md).

## Build fields around the model

- Use `FormlyFieldConfig[]` for fields and `FormlyFormOptions` for options. Let Formly create the controls from the fields.
- A field's `key` identifies a model property. A keyed `fieldGroup` nests the model; a keyless group arranges fields without adding a model level. A dotted key is a path, not a literal property name.
- Use the installed adapter's registered `type` names. In an input field, `type: 'input'` selects the Formly component and `props.type: 'email'` selects the HTML input type.
- Use `props` and `expressions` where the installed version supports them. Older projects may use `templateOptions`, `expressionProperties`, and `hideExpression`; preserve working code unless migration is part of the task. Legacy expression callbacks have different arguments from `expressions` callbacks.
- Put initial data in the model. `defaultValue` fills an undefined value, so it must not be used to overwrite an existing value such as `null`, `false`, or `0`.
- Formly attaches runtime state to field objects. Create fresh configurations for independent form instances; JSON serialization cannot clone configurations containing functions or observables.

## Handle conditional behavior deliberately

Use expressions for derived field state, such as `expressions: { 'props.disabled': (field) => !field.model?.enabled }`. For a leaf field, `field.model` is the containing model, which may be nested. Use `options.formState` for external form state rather than assuming every field sees the root model.

Hiding a field clears its model value by default in modern Formly. Use `resetOnHide: false` on fields whose values must survive hiding. Check the project's global `extras.resetFieldOnHide` setting before changing this behavior. Exercise hiding and showing with prefilled data, including nested and repeated fields.

Keep expressions free of model writes and subscriptions. If the installed version supports direct signal expressions, pass the signal itself; a callback that reads a signal still depends on Formly's expression checks.

For TypeScript configurations, prefer function expressions. For string expressions and strict CSP, check whether `withFormlyFieldExpression()` is exported and read its supported syntax before enabling it. It replaces the legacy evaluator, so existing strings may need changes. Treat remotely supplied configuration as data: use registered application behavior, validate permitted fields, and never compile remote JavaScript yourself. A CSP-safe evaluator is not an authorization boundary.

## Consult the matching documentation

Use installed declarations and examples matching the project's release as the authority for available APIs. The [Formly guides](https://formly.dev/guide) and [examples](https://formly.dev/examples) describe the deployed version. For older projects, use the corresponding release tag or versioned documentation from the [Formly repository](https://github.com/ngx-formly/ngx-formly). Do not assume the repository's main branch matches the consumer.

If the Formly MCP tools are connected, use them for focused documentation lookups:

- `formly_search` with `query` and optional `kind` finds guide, API, or example IDs.
- `formly_lookup` with a returned `topic` ID retrieves the guide or API reference.
- `formly_examples` with a returned `id` retrieves the example's exported files, including its registrations.
- `formly_validate_fields` with `source` checks a strict JSON array serialized as a string. It does not accept TypeScript objects containing functions. A structural pass does not verify registration, runtime expressions, or UI behavior.

Check the returned version and revision before adapting an MCP example. Use ordinary docs and local declarations if the tools are unavailable. MCP is optional; connection details are in the [MCP guide](https://formly.dev/guide/mcp). Hosted validation sends the supplied configuration to the service, so use synthetic data or a local validator for private configurations.

## Verify the consumer's behavior

Run the application's relevant tests and build or type check using its own scripts. For a behavior change, add a focused test through the rendered form and its model. Check the changed behavior and any affected submission, reset, validation, or hide/show flow. For arrays, check insertion and removal as well as initial rendering.

Disabled controls are excluded from an enabled Angular group's `form.value`; the Formly model can still contain their values. Verify the intended submission payload instead of switching between `model`, `form.value`, and `getRawValue()` without checking the contract. Block invalid or pending submissions according to the application's existing form flow.

Report which files changed, which checks ran, and any version or runtime behavior that remains unverified.
