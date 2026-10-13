---
name: release
description: Prepare an ngx-formly release with the repository's standard-version workflow, changelog, migration notes, and package checks. Use for /release in ngx-formly. Leaves local changes for review without committing, tagging, pushing, or publishing.
---

# Prepare an ngx-formly release

Work from the ngx-formly repository root. Accept an exact version or a bump such as `patch`, `minor`, or `major`. With no argument, infer the target from the release history and actual changes. This skill prepares local files and build output for maintainer review.

## Publishing boundary

Never run bare `npm run release`, `npm version`, `npm run publish`, `npm publish`, or `npm run github-release`. Do not stage, commit, create tags, push, create a remote release, or dispatch a publishing workflow as part of preparation. Finish with a reviewable diff and a handoff.

Pushing any `v*` tag triggers `.github/workflows/release.yml`. It builds and tests, then publishes packages to npm before creating a draft GitHub release. The GitHub draft does not make this a dry run. A request to prepare a release grants no permission to trigger that workflow.

## Inspect the release state

Read `AGENTS.md`, `CONTRIBUTING.md`, `package.json`, `CHANGELOG.md`, `build/build.ts`, `build/util.ts`, `build/publish.ts`, and both `.github/workflows/ci.yml` and `.github/workflows/release.yml`. Check for standard-version configuration and npm lifecycle hooks before executing release commands; hooks can run even during a dry run.

Record the branch, HEAD, local tags, and staged, unstaged, and untracked changes. Preserve existing work and identify which changes belong in this release. If release files already contain edits, reconcile them before generating anything. Do not stash or reset the user's work.

Find the preceding release tag reachable from this branch and inspect its release commit. Review the commits and source diff from that tag through HEAD, plus relevant local edits. Check remote tags read-only when available; report missing history or remote verification rather than treating a local tag list as proof a version is unpublished.

The release implementation has these consequences:

- The root `package.json` supplies one version for all packages listed in `PACKAGES` in `build/util.ts`. The root package is not one of the published packages.
- `standard-version` updates the root version, lockfile, and changelog. Its default commit and tag steps must be skipped.
- `build/build.ts` rebuilds `dist/@ngx-formly/`, applies the root version to generated packages, and sets their `@ngx-formly/core` peer dependency to the same version. Keep `0.0.0-FORMLY-VERSION` placeholders in source manifests.
- `build/publish.ts` publishes every package with `--access public` and does not select a prerelease dist-tag. For a prerelease target, prepare the files but flag the publishing configuration for maintainer review before any future tag push.

## Choose an exact target

Use the user's exact version when supplied and validate it as SemVer. Resolve a requested bump against the preceding release and account for any version already advanced in the working branch. Never automatically increment a version that was already prepared.

With no version supplied, use an existing unreleased root version when it fits the changes. Otherwise derive the required bump from commits and source changes. Inspect consumer peer dependency changes and public API or behavior changes; a breaking Angular requirement can be hidden under a `build` commit. Explain the selected version and its baseline before editing. Ask only when conflicting evidence leaves the intended release line unclear, and continue independent inspection while waiting.

An existing target tag or a target older than the release baseline needs resolution before editing release metadata. If the target already has an unreleased changelog entry, update that entry in place. Do not prepend another copy by rerunning the generator.

## Prepare the files

When the target entry does not exist, preview the installed release tool with an exact version and both skip flags. Substitute the resolved SemVer for `X.Y.Z`:

```sh
npm run release -- --release-as X.Y.Z --skip.commit --skip.tag --dry-run
```

Check that the preview uses the intended previous tag and includes the expected commits. If it chooses the wrong range, resolve the history or generator configuration before applying it. Once correct, apply the same command without `--dry-run`:

```sh
npm run release -- --release-as X.Y.Z --skip.commit --skip.tag
```

Review and correct the generated changelog against the source diff. Generated notes omit some commit types and uncommitted changes. Add concrete breaking changes, consumer migration steps, and relevant fixes or features that the generator missed. Preserve prior release entries and use the existing comparison-link style and the user's current date.

Keep `package.json`, the top-level `package-lock.json` version, and `packages[""].version` aligned without changing dependency resolutions. On repeat invocations, reconcile these fields and the existing target entry directly instead of generating duplicate notes.

For consumer-facing breaking changes, create or update the matching `UPGRADE-*.md` using nearby guides. Check related documentation and examples when public behavior changes require them. Keep these edits specific to changes actually included in the release.

## Validate and hand off

Use the Node version in `.node-version` and npm version in `packageManager`; run `npm ci` if dependencies need installation. Run the checks in the current CI workflow, including the full unit suite, lint, formatting, all-package build, bundle-size checks, and SSR checks. Run duplicate CI steps only once. Report failures and unavailable checks; do not change dependencies or weaken checks to obtain a pass.

After building, inspect every package listed in `PACKAGES` under `dist/@ngx-formly/`. Verify its version, internal core peer version where present, and package entry points. Check that generated manifests contain no unresolved version placeholders. Inspect package contents with `npm pack --dry-run --ignore-scripts --json` from each built package directory. This inspects the tarball contents without publishing or invoking lifecycle scripts.

Finish with `git diff --check`, the relevant staged and unstaged diffs, and `git status --porcelain=v1 --untracked-files=all`. Account for generated files from the schematics build; exclude them from the release handoff and preserve any pre-existing changes. Verify HEAD, the index, and tags were not changed by preparation.

Report the chosen version and previous tag, files prepared, validation results, and any blockers. State that nothing was committed, tagged, pushed, or published. Suggest a release commit subject consistent with `commitlint.config.js`, such as `release: prepare X.Y.Z`. Explain that the maintainer's later push of the release tag starts npm publication; leave that action to the maintainer.
