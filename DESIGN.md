---
name: Formly documentation website
description: Angular form documentation with runnable examples and a compact navigation system.
colors:
  site-background: "#ffffff"
  site-ink: "#18161b"
  site-muted: "#625d68"
  site-accent: "#a52364"
  site-accent-soft: "#f6e7ef"
  site-line: "#dedbe2"
  site-soft: "#f7f5f9"
  white: "#ffffff"
  hero-background: "#111014"
  hero-accent: "#f5b6dc"
  hero-accent-hover: "#ffd4ed"
  hero-button-ink: "#271520"
  hero-button-border: "#726577"
  hero-secondary-hover: "#2b232e"
  hero-muted: "#d2ccd7"
  code-ink: "#813457"
typography:
  display:
    fontFamily: "Inter Tight, Roboto, sans-serif"
    fontSize: "clamp(48px, 7vw, 88px)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Inter Tight, Roboto, sans-serif"
    fontSize: "clamp(32px, 4vw, 48px)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter Tight, Roboto, sans-serif"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  guide-title:
    fontFamily: "Inter Tight, Roboto, sans-serif"
    fontSize: "44px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  guide-heading:
    fontFamily: "Inter Tight, Roboto, sans-serif"
    fontSize: "32px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  reading:
    fontFamily: "Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.75
  navigation:
    fontFamily: "Roboto, sans-serif"
    fontSize: "14px"
    lineHeight: 1.5
    letterSpacing: "normal"
  code:
    fontFamily: "Consolas, Liberation Mono, Menlo, monospace"
    fontSize: "0.9em"
    lineHeight: 1.6
rounded:
  inline-code: "4px"
  control: "6px"
  document: "8px"
  example: "12px"
spacing:
  compact: "8px"
  small: "12px"
  control: "16px"
  gutter-mobile: "20px"
  content: "24px"
  example: "28px"
  group: "32px"
  section-gap: "36px"
  gutter: "48px"
  section-mobile: "52px"
  column-gap: "64px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.hero-accent}"
    textColor: "{colors.hero-button-ink}"
    rounded: "{rounded.control}"
    padding: "10px 22px"
  button-primary-hover:
    backgroundColor: "{colors.hero-accent-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "10px 22px"
  button-secondary-hover:
    backgroundColor: "{colors.hero-secondary-hover}"
  section-navigation:
    backgroundColor: "{colors.site-soft}"
    textColor: "{colors.site-muted}"
    typography: "{typography.navigation}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  section-navigation-active:
    backgroundColor: "{colors.site-accent-soft}"
    textColor: "{colors.site-accent}"
  document-code:
    backgroundColor: "{colors.site-soft}"
    rounded: "{rounded.document}"
    padding: "24px"
  document-details:
    textColor: "{colors.site-accent}"
    rounded: "{rounded.document}"
    padding: "16px 20px"
  example-viewer:
    backgroundColor: "{colors.site-background}"
    textColor: "{colors.site-ink}"
    rounded: "{rounded.example}"
  learning-link:
    textColor: "{colors.site-ink}"
    padding: "28px 0"
---

# Design System: Formly documentation website

## Overview

**Creative North Star: "angular.dev documentation reference"**

The user pinned [angular.dev](https://angular.dev/) as the visual reference. Formly keeps its name and logo, with a compact navigation rail, Inter Tight headings, and a restrained magenta accent. The homepage uses a dark introduction and a working configuration-to-form example. Guides use a white reading area beside a pale section sidebar.

This system covers the website around the examples. The forms inside examples keep their UI adapter's controls, validation, and interaction states. The source files are the authority for implementation; the tokens above record their reusable values. Page composition and intent remain in the [homepage brief](.impeccable/surfaces/demo-src-app-home-component-ts.md) and [documentation brief](.impeccable/surfaces/demo-src-app-app-component-ts.md).

**Key Characteristics:**

- Inter Tight headings with Roboto body text.
- Thin borders and pale backgrounds separate navigation, code, and forms.
- A near-black homepage introduction with pale pink actions.
- Runnable examples retain the appearance of their selected UI library.

## Colors

Light mode uses dark text, pale lavender neutrals, and magenta links and active states. Dark mode uses near-black surfaces, light text, and pale pink accents. The `data-bs-theme` attribute on the document root selects the palette.

| CSS token | Light | Dark |
| --- | --- | --- |
| `--site-background` | `#ffffff` | `#111014` |
| `--site-ink` | `#18161b` | `#f3eff6` |
| `--site-muted` | `#625d68` | `#b8b0c0` |
| `--site-accent` | `#a52364` | `#f5b6dc` |
| `--site-accent-soft` | `#f6e7ef` | `#34212f` |
| `--site-line` | `#dedbe2` | `#3c3642` |
| `--site-soft` | `#f7f5f9` | `#1b181f` |
| `--site-code` | `#813457` | `#f5b6dc` |
| `--site-success` | `#286545` | `#8cdbad` |
| `--site-accent-contrast` | `#ffffff` | `#271520` |

Use these variables for shared surfaces, including overlays. The homepage introduction keeps its dark palette in both modes. Syntax highlighting uses the corresponding GitHub light or dark theme. Bootstrap, Material, PrimeNG, Ionic, and NG-ZORRO use their native theme support; Kendo uses its surface color variables.

### Primary

- `site-accent` is the documentation link, active navigation, focus-outline, loading-bar, and selection color.
- `site-accent-soft` marks active navigation against pale or white backgrounds.
- `hero-accent` colors the emphasized display line and primary homepage action. Its hover token lightens the action.

### Neutral

- `site-ink` and `site-muted` distinguish primary content from supporting copy.
- `site-background`, `site-soft`, and `site-line` define reading areas, code and sidebar backgrounds, and boundaries.
- `hero-background` provides the dark introductory area. `hero-muted` supports body copy there.
- `hero-button-ink`, `hero-button-border`, and `hero-secondary-hover` belong to actions on that dark background.
- `code-ink` distinguishes inline code. Syntax highlighting retains the imported GitHub theme.

**The Contextual Accent Rule.** Use magenta for links and navigation on light backgrounds and pale pink on dark backgrounds. Adapter control colors remain owned by their UI library.

## Typography

Inter Tight supplies display and document headings at weight 500. The site self-hosts that weight in `demo/src/assets/fonts/inter-tight-medium.ttf`; its license sits beside it. Roboto remains the body family, loaded by `demo/src/index.html`. Both stacks end in sans-serif fallbacks.

The `display`, `headline`, and `title` roles describe homepage headings. The `guide-title` and `guide-heading` roles describe guide headings; subsequent guide levels use 25px, 21px, and 18px with the same weight, line height, and tracking. Guide headings have 48px top spacing and 20px bottom spacing.

The `body` role is the homepage baseline. The `reading` role gives paragraphs more leading. Section navigation uses `navigation`; rail labels are 13px. The example viewer title uses Inter Tight at 20px with a 1.4 line height.

Code uses monospace. Inline document code uses the `code` role; code blocks have a 14px container size. The homepage and example viewer keep their existing code-font inheritance and syntax highlighting.

**The Heading Weight Rule.** Use the shipped Inter Tight medium face for website headings. Keep the adapter's own typography inside runnable forms.

## Layout

Desktop navigation occupies a fixed 104px rail. Documentation adds a 250px section sidebar. The reading container is at most 920px wide, including 48px padding. Homepage sections and example viewers are at most 1120px wide. Homepage containers leave 48px on each side when the viewport limits their width.

The section sidebar only shows the current section's topics on desktop. The theme control sits below GitHub at the bottom of the rail and moves into the mobile header. Its keyboard-accessible menu offers System, Dark, and Light. System is the default and follows operating-system changes. Explicit choices persist in browser storage; blocked storage only prevents persistence.

Homepage section introductions use two columns in a 1:0.8 ratio with a 64px gap. The configuration and form example use equal columns. Adapter links use three columns, and learning links use two. Major homepage sections use the section spacing token; the adapter section uses 72px vertical padding.

At widths up to 767px, the rail becomes a 64px header and the section navigation becomes an overlay drawer. Homepage containers leave 20px side gutters. Introductory, example, and learning grids stack; adapter links retain two columns. Major sections use the mobile section spacing token. The document container uses 32px vertical and 20px horizontal padding, with guide titles reduced to 36px and guide second-level headings to 28px.

Long code and tables scroll within their containers. Model output can wrap. YouTube embeds use a responsive 16:9 ratio; other embedded content preserves its authored height.

## Elevation & Depth

Website containers use pale fills and thin borders. The custom hero, navigation rail, code containers, and example wrappers do not add shadows. Angular Material menus, drawers, and controls retain their library behavior, as do the controls from every other adapter.

**The Bordered Container Rule.** Separate website code, navigation, and example areas with the shared line color and background tones. Use the existing UI library for overlay and control elevation.

## Shapes

The rail, page sections, tables, and learning-link rows have straight boundaries. Inline code uses the smallest radius; homepage actions and section links use the control radius. Document code, disclosure containers, and media use the document radius. Example wrappers use the largest radius, with their headings following the top corners.

Borders are generally 1px. The active rail item adds a colored left border as well as a pale fill. Preserve the original Formly logo shape.

## Components

### Homepage actions

Primary actions pair pale pink with dark text. Secondary actions are transparent with a muted border and white text. Both have a minimum height of 48px, a 12px content gap, and the control radius. Their background transition lasts 160ms with ease-out timing; reduced-motion preference removes it. Keyboard focus uses a 3px outline with a 5px offset, pale pink inside the hero. On mobile, horizontal padding reduces to 16px and the action row can wrap.

### Navigation

Rail links place an icon above a short label in an 82px minimum-height target. Hover uses the soft background and primary text; the active route uses the accent fill, text, and left border. Keyboard focus has a 2px accent outline inset by 4px.

Section links use the control radius, a minimum height of 40px, and 2px vertical margins. Child links indent to 20px. Their active state uses the shared accent colors; focus has a 2px outline inset by 2px. The mobile drawer closes after selecting a destination. The skip link appears on focus and moves focus to the main content.

The search button sits below the version selector, with a Cmd/Ctrl+K shortcut hint on desktop. On mobile it becomes an icon in the header; GitHub remains available in the footer. Search opens a dialog with the shared background, border, and focus colors. Results show their section, title, and a matching text excerpt. Arrow keys navigate results, Enter opens a page, and Escape closes the dialog and restores focus. The dialog and its local index load on demand. Guides and migrations support text search; UI and example pages are searchable by name and category.

### Reading content

Document links are underlined with a 3px offset. Hover thickens the underline and keyboard focus adds a 2px outline with a 3px offset. Code blocks use the document radius, border, and background tokens, with 24px padding reduced to 16px on mobile. Preserve unwrapped source lines and horizontal scrolling.

Disclosures use a bordered container and a native summary marker. Summary text uses the accent and weight 500. Its focus outline has a 4px offset; opening the disclosure adds 16px below the summary. Tables use the shared line color, soft header background, and tabular numerals.

### Example containers

The homepage pairs configuration and a real Formly form inside one bordered wrapper. A divider separates the columns, then separates the stacked panels on mobile. Each heading is at least 58px high with 16px by 28px padding. The form and model output remain working content.

The reusable example viewer has a sticky pale title bar with 12px by 20px padding. Its body has 28px padding, reduced to 20px by 16px on mobile. Source, copy, debug, and StackBlitz actions retain their established behavior and accessible names.

### Form fields

The homepage uses Bootstrap fields. Other examples use their selected adapter. Preserve labels, required markers, validation messages, disabled states, and native focus styling. The sidecar's Bootstrap field sample records that adapter only; it is not a website-wide field theme.

### Resource links

Adapter and learning links form rows separated by thin rules. Adapter links change text color on hover; learning links change their heading color. Preserve their link targets and visible keyboard focus. These rows do not use raised cards or pill shapes.

## Do's and Don'ts

### Do:

- Do use the shared website colors for navigation, documentation, and example containers.
- Do preserve the Formly name and logo.
- Do use Inter Tight medium for website headings and Roboto for body copy.
- Do keep form controls and their states faithful to the selected UI adapter.
- Do keep code selectable, allow horizontal scrolling, and preserve visible keyboard focus.
- Do preserve authored embed heights except for the responsive YouTube treatment.

### Don't:

- Don't apply homepage display sizing or dark hero colors to guide body content.
- Don't turn the website's magenta accent into a global override of adapter controls.
- Don't remove labels, validation messages, required markers, or accessible action names to simplify a preview.
- Don't add shadows to the website's bordered code and example containers.
