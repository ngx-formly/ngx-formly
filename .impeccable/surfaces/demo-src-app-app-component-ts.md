---
version: 1
slug: "demo-src-app-app-component-ts"
primary_target: "demo/src/app/app.component.ts"
related_targets: ["demo/src/app/app.component.html","demo/src/app/app.component.scss","demo/src/styles.scss","demo/src/styles/_sidenav.scss","demo/src/markdown.css","demo/src/app/shared/example-viewer/example-viewer.component.scss"]
---

# Documentation website

Mode: Read. The user explicitly expanded the task to the entire documentation website on 2026-10-13. Includes navigation, guides, example viewers, responsive behavior, and the existing homepage brief.

## Direction contract

THESIS: Make Angular form documentation easy to navigate and read while keeping runnable examples accurate.

OWN-WORLD: Follow the angular.dev reference with a compact navigation rail, pale sidebar, white reading area, restrained magenta active states, and Inter Tight headings. Preserve adapter-native controls.

STORY: Pick Guides, UI, or Examples, find the relevant topic, read the explanation, inspect the code, and try the form.

FIRST VIEWPORT: Desktop uses a 104px rail and 250px section sidebar around a bounded reading column. Mobile uses a 64px header and an overlay drawer. The guide heading and introduction precede an optional video.

FORM: User-pinned angular.dev documentation system. Shared direction seed 359ef134. The homepage retains Persuade mode; guide and example pages prioritize reading and operation. Existing source tabs, copying, debugging, and StackBlitz actions remain functional.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
