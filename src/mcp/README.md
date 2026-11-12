# @ngx-formly/mcp

A public, stateless Streamable HTTP MCP service for searching Formly documentation, retrieving demo source, and checking field configurations. It shares the validator used by the [JSON validator](https://formly.dev/tools/validator). The package has no Angular runtime dependency.

The configured production endpoint is `https://formly.dev/mcp`. It becomes available when this change is deployed to the existing Netlify site. No authentication is required. Use an MCP client that supports Streamable HTTP; the service accepts protocol revision `2026-07-28` and the SDK's stateless 2025 compatibility flow.

## Documentation and example tools

| Tool | Arguments | Result |
| --- | --- | --- |
| `formly_search` | `query`, optional `kind`, `limit`, `offset` | Ranked guide, API, and example summaries. |
| `formly_lookup` | `topic` | A guide, package reference, or API symbol's full Markdown. |
| `formly_examples` | Optional `id`, `limit`, `offset` | Example summaries, or one example's exported project files. |

Try `formly_search` with `{"query":"FormlyFieldConfig","kind":"api"}`, then `formly_lookup` with `{"topic":"api/core#formlyfieldconfig"}`. Retrieve a complete example with `formly_examples` and `{"id":"examples/advanced/repeating-section"}`.

Search accepts 1 to 200 characters and filters `kind` to `guide`, `api`, or `example` when supplied. Search and example listings default to 10 results with a maximum `limit` of 20 and a zero-based `offset`. They return `results`, `total`, and `nextOffset`, which is null on the last page. Summaries include `id`, `kind`, `title`, `url`, and `sourceUrl`.

Lookup accepts an exact ID or a unique title or symbol name. Ambiguous names return candidate IDs. Omit `id` to list examples, or supply an exact ID to receive `description` and `files`, a map of project paths to source text. Files use the website exporter, including provider configuration, custom types, dependencies, and assets. Shared UI samples use Bootstrap; adapter-specific samples use their named adapter. The decorative favicon is omitted. Unknown IDs and invalid arguments are tool errors.

Successful responses include `structuredContent` and an equivalent JSON text block, plus package `version` and build `revision`. Content comes from the server build, which may differ from a consumer's installed Formly version. Local builds may contain uncommitted changes on top of that revision. No documentation requests access the network or the caller's filesystem. Retrieved source is never executed.

## Validation tool

`formly_validate_fields` accepts `{ "source": "[{\"key\":\"email\",\"props\":{\"required\":true}}]" }`. Send the original JSON text so syntax errors and source locations can be reported. A single field must be wrapped in an array. Comments, trailing commas, and JavaScript object syntax are rejected.

The response includes both `structuredContent` and an equivalent JSON text block:

- `status`: `empty`, `invalid`, or `no-structural-errors`.
- `syntaxValid`, total `errorCount` and `warningCount`, and `truncated`.
- Up to 100 `diagnostics`, each with `severity`, `message`, `path` segments, a readable `label`, UTF-16 `offset` and `length`, and one-based `line` and `column`.
- `scope`, package `version`, and the source commit `revision` baked into the build. A local build may include uncommitted changes on top of that revision.

Empty input is neutral; `[]` passes. Warnings can accompany `no-structural-errors`. Invalid configurations are normal tool results; invalid tool arguments, oversized source, and unexpected failures are tool errors.

Checks cover strict JSON and shared configuration structure, including nested fields, supported deprecated aliases, and likely property misspellings. Custom types, wrappers, properties, and arbitrary option data remain supported. Expressions are never executed. Registration, application behavior, adapter-specific rules, and model validation are outside the scope; a structural pass cannot guarantee that a form works at runtime.

## Limits and privacy

- HTTP request body: 1 MiB, including the JSON-RPC envelope and JSON escaping.
- Decoded `source`: 256 KiB of UTF-8 text.
- Results: the first 100 diagnostics in source order; counts include omitted diagnostics.
- Netlify: 60 requests per 60 seconds per IP and domain, including discovery and tool listing. Excess traffic receives HTTP 429; clients should back off. Netlify enforcement can lag briefly.

The service processes submitted configurations in memory. It has no application storage and does not log request bodies or configurations. Hosting infrastructure can retain request metadata. Unlike the browser-only validator, this tool sends its input to the hosted service.

Browser requests must come from the site's configured production or deployment origins; requests without an `Origin` header are accepted. There are no cookies, credentials, sessions, or persistent subscription streams. Origin checks are not authentication.

## Local review

From the repository root, run `npm ci`, then `npm run mcp:serve`. Connect a Streamable HTTP MCP client to `http://127.0.0.1:4101/mcp`. The website remains on port 4100. Local serving enforces body and source limits, but Netlify's edge rate limit applies only on Netlify.

Run the focused tests with `npm test -- --project mcp`. `npm run build:mcp` builds the package under `dist/@ngx-formly/mcp` and its Netlify adapter under `dist/functions`; the normal package build and release scripts include it too. The adapter bundles the built package through the repository's TypeScript path mapping.

The build generates a documentation snapshot from the guide registry, the API generator, and demo source listings. It reuses the website's example exporter without loading Angular components. The snapshot is embedded in the JavaScript bundle; no generated content file needs to be committed. Edit the original guides, API declarations, or demos, then rebuild. Tests use the checked-in API reference; `npm run docs:check` verifies that it is current. Run `node --test build/mcp.test.mjs` after building to verify source coverage and the installed package, including all four tools without Angular installed.

## Hosting elsewhere

```ts
import { createFormlyMcpHandler } from '@ngx-formly/mcp';

export default createFormlyMcpHandler({
  allowedHosts: ['forms.example.com'],
  allowedOrigins: ['https://forms.example.com'],
});
```

The returned object exposes `fetch(Request): Promise<Response>` and `close(): Promise<void>`. Pass trusted deployment configuration for the allowlists; do not derive them from incoming headers. Apply a request rate limit at your hosting layer. The package itself enforces payload limits but cannot enforce a distributed per-IP rate limit.

The repository's Netlify adapter lives in `demo/functions/mcp.ts`, with route and rate-limit settings colocated. The root `netlify.toml` builds the package and adapter before the website and deploys `dist/functions`. The build embeds `URL`, `DEPLOY_URL`, and `DEPLOY_PRIME_URL` in the adapter's allowlist because [preview URL variables are unavailable at runtime](https://docs.netlify.com/build/functions/environment-variables/#netlify-read-only-variables). The platform's site URL is also allowed. Documentation archives retain their static-only build configuration.
