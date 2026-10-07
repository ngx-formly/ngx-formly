# Repository guidance

These instructions apply throughout the repository. Read [CONTRIBUTING.md](CONTRIBUTING.md) and follow the conventions in nearby code.

## Project map

ngx-formly is a TypeScript library for building dynamic forms with Angular Reactive Forms.

- `src/core/src/lib/`: form components, field models, builder/config services, extensions, and shared utilities.
- `src/core/{json-schema,select,preset,testing}/`: secondary entry points for schema conversion, select options, presets, and test helpers.
- `src/ui/`: Bootstrap, Material, Ionic, PrimeNG, Kendo, NG-ZORRO, and NativeScript adapters. Individual controls often live in secondary entry points such as `src/ui/bootstrap/input/src/`.
- `src/schematics/`: Angular CLI installation schematics and their tests.
- `demo/src/app/examples/` and `demo/src/app/ui/`: runnable examples and UI demonstrations; routes and navigation live under `demo/src/app/`.
- `docs/`, `README.md`, and `UPGRADE-*.md`: guides, project overview, and migration instructions.
- `integration/ssr/` and `cypress/ssr/`: SSR application and end-to-end checks.
- `build/`: package build and publishing scripts. Generated packages go to `dist/@ngx-formly/`.

## Setup and commands

Run commands from the repository root. Use the Node version in `.node-version` and the npm version declared by `packageManager` in `package.json`. Install dependencies with `npm ci`; preserve `package-lock.json` unless dependencies intentionally change.

| Task | Command |
| --- | --- |
| Run the demo on port 4100 | `npm run demo` |
| Run a single spec | `npm test -- --runInBand --runTestsByPath src/core/src/lib/services/formly.builder.spec.ts` |
| Run core tests | `npm test -- --runInBand src/core` |
| Run all unit tests | `npm test -- --runInBand` |
| Watch tests | `npm run test:watch` |
| Check TypeScript and HTML lint | `npm run lint` |
| Check formatting | `npm run format` |
| Build all packages, including schematics | `npm run build` |
| Build core only | `npx ng build @ngx-formly/core --configuration production` |
| Build one UI adapter | `npx ng build @ngx-formly/bootstrap --configuration production` |
| Run SSR end-to-end tests | `npm run e2e:ssr` |

Replace the example spec or adapter with the affected one. UI library builds resolve core from `dist/`, so build core first. Unit tests resolve library imports directly to source and do not need a package build.

`npm run demo` opens a browser. `npm run e2e:ssr` builds the SSR application, starts it on port 4200, runs Cypress, and stops the server.

### Testing in a consuming application

Prefer `npm link` to test local Formly changes in a consuming application. Build core first, then any affected UI adapters, and link the built packages under `dist/@ngx-formly/` from the consumer. Verify that all adapters resolve the linked core and that Angular and RxJS resolve to a single instance. Keep the consumer's manifests and lockfile unchanged, remove the temporary links after validation, and restore its pinned packages. Follow the consumer's instructions for its running development server.

## Making changes

- Trace the affected flow and callers before editing. Reuse existing utilities and fix shared behavior in core; keep UI-specific behavior in the corresponding adapter.
- Keep changes focused. Avoid new dependencies, abstractions, or unrelated refactors when existing code handles the task.
- Follow `.editorconfig`, `.prettierrc.json`, and the applicable `.eslintrc.json`: two-space indentation, single quotes, semicolons, trailing commas, and a 120-column Prettier print width.
- Match existing Angular component/module and change-detection patterns. Preserve form-control bindings, `formlyAttributes`, labels, validation messages, and accessibility attributes when changing field templates.
- Respect package boundaries and `src/public_api.ts` exports. Use package entry points for cross-package imports; do not make an internal helper public merely to simplify an import.
- Check package `peerDependencies` when using Angular, RxJS, or UI-library APIs. The installed development version alone does not define consumer compatibility.
- Leave `0.0.0-FORMLY-VERSION` placeholders in source package manifests; the build replaces them. Edit source files rather than generated `dist/`, `out-tsc/`, coverage, or cache output.
- Document public API changes and add or update a relevant demo example. Update migration guidance when behavior changes require consumers to adjust their code.

## Validation

- Add a regression spec for bug fixes and specs for new behavior, following the existing colocated `*.spec.ts` tests.
- Reuse `createFieldComponent`, `createComponent`, and `createBuilder` from `@ngx-formly/core/testing` where appropriate. Jest maps this entry point to `src/core/testing/src/private_api.ts` for repository tests.
- Jest uses `jest-preset-angular` and Happy DOM. Its test roots are `src/` and `demo/src/app/ui/`; SSR Cypress tests run separately.
- Start with affected specs. For shared core changes, run the full unit suite because all UI adapters depend on core. Run lint, formatting, and relevant package builds for code changes; include SSR checks when server rendering is affected.
- Use `.github/workflows/ci.yml` as the reference for full CI validation, including bundle-size checks. Report checks actually run and any failures or checks you could not run.
- For documentation-only changes, verify paths, commands, links, and the diff. The repository's formatting script excludes Markdown; application tests are unnecessary unless behavior also changes.
- Avoid repository-wide autofixes for a small change; format or fix only affected files.

## Git and handoff

- Preserve unrelated local changes. Do not stage, commit, amend, or push unless the user explicitly asks.
- Before the final response, run `git status --porcelain=v1 --untracked-files=all` and inspect relevant staged, unstaged, and untracked changes.
- Summarize what changed and how it was verified. If unrelated changes are present, identify this task's files.
- If a completed, meaningful change remains uncommitted, end the response with `Suggested commit:` followed by the proposed message in backticks. Describe only this task's changes. Skip the suggestion for read-only tasks, clean repositories, already committed or reverted work, incomplete work, ignored/temporary artifacts, and inconsequential cosmetic edits. Meaningful documentation changes qualify.
- Follow the Angular-style commit conventions in `commitlint.config.js`: `type(scope): concise imperative subject`. Use a configured scope when applicable (for example, `core`, `material`, `guides`, or `testing`); do not invent scopes. A commit suggestion does not authorize committing.
