# MCP tools

The Formly MCP service lets an assistant search guides and API references, retrieve demo source, and check field configurations using the same structural rules as the [JSON validator](/tools/validator).

Connect your MCP client's **Streamable HTTP** transport to `https://formly.dev/mcp`. This endpoint becomes available when the service is deployed. No authentication is required. For a local checkout, run `npm run mcp:serve` and use `http://127.0.0.1:4101/mcp` instead.

## Find documentation and examples

The service bundles the guides, API reference, and demo source from its build. Requests do not fetch websites or read files from your project. Results identify the package `version` and build `revision`; check that they match the Formly version you use. A local build can include uncommitted changes on top of that revision.

| Tool | Arguments | Result |
| --- | --- | --- |
| `formly_search` | `query`, optional `kind`, `limit`, `offset` | Matching guide, API, and example IDs with titles and links. |
| `formly_lookup` | `topic` | Full guide, package reference, or API symbol documentation. |
| `formly_examples` | Optional `id`, `limit`, `offset` | An example list, or the named example's exported project files. |

For example, ask your assistant to find the repeating-section example and explain how its custom type is registered:

1. Call `formly_search` with `{"query":"repeating section","kind":"example"}`.
2. Call `formly_examples` with `{"id":"examples/advanced/repeating-section"}`.
3. Call `formly_lookup` with `{"topic":"api/core#fieldarraytype"}` to read the base class reference.

Search accepts up to 200 characters and optionally filters `kind` to `guide`, `api`, or `example`. Search and example listings return `results`, `total`, and `nextOffset`. They default to 10 results, accept `limit` from 1 to 20, and use a zero-based `offset`. A null `nextOffset` means there are no more results.

Lookup accepts an exact ID from search, such as `guide/validation` or `api/core#formlyfieldconfig`. Unique titles and symbol names also work. Ambiguous names return candidate IDs. Unknown topics and example IDs return tool errors.

Omit `id` from `formly_examples` to browse examples. Retrieve an ID to receive a `files` object mapping project paths to source text. The files use the website's exporter, including provider setup, custom types, dependencies, and assets. Shared UI samples use Bootstrap; adapter-specific samples use their named adapter. Examples are returned as source and are never executed. Their TypeScript files cannot be passed directly to the JSON validator.

## Validate fields

Call `formly_validate_fields` with the original JSON array as a `source` string:

```json
{
  "source": "[{\"key\":\"email\",\"type\":\"input\",\"props\":{\"required\":\"yes\"}}]"
}
```

This reports an error at `$[0].props.required`: `required` must be a boolean or null. Each diagnostic includes a message, severity, path segments, source offset and length, and line and column. Lines and columns start at one; offsets and lengths count UTF-16 code units, as JavaScript editors do.

Use strict JSON with double quotes. Wrap a single field in an array. Comments, trailing commas, functions, and JavaScript object syntax are not accepted. Empty input is neutral; `[]` is valid.

The result's `status` is `empty`, `invalid`, or `no-structural-errors`. A structural pass can still include warnings for deprecated aliases or likely misspellings. Custom types, wrappers, and properties remain supported. A pass does not verify component registration, expressions, adapter behavior, or model values. The service never executes expressions or application code.

## Public service limits

The endpoint accepts HTTP bodies up to 1 MiB. The validator accepts source strings up to 256 KiB in UTF-8 and returns the first 100 diagnostics with counts for the complete result and a `truncated` flag. Responses also identify the validator's package version and build revision.

Netlify limits requests to 60 per minute per IP and domain, including discovery and tool listing. Clients should back off after HTTP 429. Local serving applies payload limits; Netlify applies the rate limit after deployment.

This tool sends the configuration to the hosted service for processing in memory. It does not save configurations or log their contents; hosting infrastructure can retain request metadata. Use the browser [JSON validator](/tools/validator) when you want the configuration to stay on your device.

The service supports MCP `2026-07-28` and stateless 2025 clients. Browser requests are restricted to the site's configured origins. There is no authentication, session storage, or persistent event stream.

For package integration and self-hosting, see the [@ngx-formly/mcp README](https://github.com/ngx-formly/ngx-formly/blob/main/src/mcp/README.md).
