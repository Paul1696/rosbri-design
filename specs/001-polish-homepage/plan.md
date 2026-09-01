# Implementation Plan: Polish Rosbri Design Homepage

**Branch**: `refonte-rosbri-v2` (working branch) | **Feature Context**: `001-polish-homepage` | **Date**: 2026-08-17 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-polish-homepage/spec.md`

## Summary

Polish the existing homepage in place so its hero, category discovery, featured merchandising,
brand story, and responsive rhythm present Rosbri Design as a premium African-inspired fashion
and lifestyle brand. Preserve the static-site architecture, shared header/cart components,
catalogue data, taxonomy, routes, and WhatsApp flows. Consolidate conflicting homepage styles,
curate existing catalogue items deterministically, simplify low-value controls, and validate
the result across desktop, tablet, mobile, keyboard, reduced-motion, and existing shopping
paths.

## Technical Context

**Language/Version**: HTML5, CSS3, vanilla JavaScript (ES6+); Node.js 24.16.0 for build and checks

**Primary Dependencies**: Existing shared component loader; local Tailwind CSS 3.4.17 build;
no new runtime dependency

**Storage**: Static files plus existing browser-side cart persistence; no new storage

**Testing**: `npm test` (`scripts/verify-site.js`), `npm run build`, browser interaction checks,
responsive visual review, keyboard and reduced-motion review, WCAG contrast audit, and recorded
desktop/mobile Core Web Vitals measurements

**Target Platform**: Static web hosting and current evergreen desktop/mobile browsers;
HTTP-served local validation on `127.0.0.1:4173`

**Project Type**: Existing static e-commerce website

**Performance Goals**: Meet LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1 without regression from
the recorded desktop/mobile baseline; keep the dominant hero asset optimized; lazy-load
non-critical imagery; keep motion smooth and limited to transform/opacity

**Constraints**: Preserve routes, catalogue schema, cart and WhatsApp behavior; no horizontal
overflow from 320–1440 px; usable at 200% text enlargement; no distorted imagery; no account,
wishlist, sorting, or other unsupported capability

**Scale/Scope**: One homepage, shared header only where necessary, 467 existing catalogue
products, six canonical taxonomy universes, nine existing homepage sections

## Constitution Check

*GATE: Passed before Phase 0 research and re-checked after Phase 1 design.*

- **Brand identity**: PASS — the plan prioritizes premium editorial hierarchy, restrained
  African-inspired art direction, whitespace, and removal of redundant homepage controls.
- **Responsive image integrity**: PASS — desktop, tablet, and mobile compositions are distinct;
  packshots remain contained and all imagery retains intrinsic ratio.
- **Existing product preservation**: PASS — the current static stack, routes, data, shared
  components, cart, search, modal, and WhatsApp flows remain authoritative.
- **Reusable implementation**: PASS — existing tokens, taxonomy, catalogue, product cards, and
  shared mount components are reused; no dependency or parallel component system is added.
- **Performance and accessibility**: PASS — image priority, lazy loading, stable media regions,
  focus states, keyboard operation, reduced motion, and regression checks are planned.
- **Workflow gate**: PASS — current markup, CSS override history, JavaScript flows, catalogue
  shape, assets, and baseline tests were inspected before design.

No constitution exception is required.

## Project Structure

### Documentation (this feature)

```text
specs/001-polish-homepage/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── homepage-ui-contract.md
├── checklists/
│   └── requirements.md
└── tasks.md                 # Created later by $speckit-tasks
```

### Source Code (repository root)

```text
index.html                   # Existing homepage structure and editorial content
catalog-data.js              # Authoritative product catalogue (unchanged schema)
catalog.js                   # Existing catalogue lookup and category behavior
components/
├── header.html              # Shared navigation source
├── mobile-menu.html         # Shared mobile navigation source
├── cart-drawer.html         # Existing shopping-cart interface
└── footer.html              # Shared footer source
css/
├── tokens.css               # Existing design tokens
├── base.css                 # Global element and accessibility foundations
├── components.css           # Shared cards, header, buttons, and components
├── home.css                 # Authoritative homepage-specific styles after cleanup
├── home-redesign.css        # Legacy override layer to retire after verified consolidation
├── responsive.css           # Shared cross-page responsive rules
└── cart.css                 # Existing cart behavior styling
js/
├── components.js            # Shared-component loader and local fallbacks
├── home-products.js         # Homepage selection and safe card rendering
├── main.js                  # Homepage modal, filters, FAQ, and reveal behavior
├── taxonomy.js              # Six canonical product universes
├── cart.js                  # Existing cart behavior
├── header.js                # Existing header behavior
└── qa-check.js              # Runtime diagnostics
images/
├── hero/                    # Existing composite and layered hero assets
└── articles-site/           # Existing catalogue and editorial imagery
scripts/
└── verify-site.js           # Existing structural/catalogue regression suite
```

**Structure Decision**: Keep the current single static-site layout. Make homepage structure and
copy changes in `index.html`, place final page-specific rules in `css/home.css`, retain shared
rules in their current files, and update `js/home-products.js`/`js/main.js` only where behavior
must change. Remove the `home-redesign.css` link only after its still-valid declarations are
consolidated and visual parity is verified. Update both source component files and embedded
fallbacks only if a shared component genuinely changes.

## Implementation Strategy

### 1. Establish a visual and behavioral baseline

- Capture desktop (1440 px), tablet (1024/768 px), and mobile (390/320 px) states before edits.
- Record desktop and mobile LCP, INP, and CLS baselines under repeatable local-server conditions.
- Record hero, category, product, modal, search, mobile menu, cart, FAQ, and outbound WhatsApp
  interactions that must continue working.
- Inventory image intrinsic dimensions and flag assets whose current CSS can distort or crop
  meaningful product content.

### 2. Clarify homepage hierarchy without rebuilding it

- Preserve the existing semantic main/header/footer mounts and functional modal.
- Refine section order and copy density around the core journey: hero → curated products →
  product universes → concise brand/editorial proof → supporting customization/B2B/FAQ content.
- Keep valuable existing sections, but compress or merge repetitive messaging where it weakens
  hierarchy. Do not create unsupported business claims.

### 3. Stabilize the hero composition

- Use the existing optimized premium composite as the desktop visual foundation because it
  gives predictable art direction at substantially lower weight than loading every large PNG
  layer.
- Use a simplified contained product composition on mobile so imagery cannot cover text or CTAs.
- Remove contradictory hero overrides, including obsolete `object-fit: fill` and repeated
  display rules. Define one authoritative rule set per breakpoint.
- Keep one primary catalogue CTA. Retain the customization action only if it remains visually
  subordinate and its existing modal flow passes regression checks.
- Limit motion to subtle CTA/interactive feedback and disable non-essential movement for
  reduced-motion users.

### 4. Curate real products and universes

- Replace weekly pseudo-random homepage rotation with a deterministic curated set of existing
  product IDs, with category-based fallbacks when an item disappears.
- Present a compact cross-category selection without homepage filter controls; the catalogue
  remains the place for broad filtering and discovery.
- Reuse `ROSBriCatalog` and `ROSBriTaxonomy`; do not duplicate names, prices, routes, or category
  truth in markup.
- Present active consumer universes from the six canonical taxonomy definitions. Keep the
  existing enterprise universe in its dedicated B2B section rather than duplicating it as a
  consumer category.
- Define explicit empty/fallback behavior for missing images, prices, categories, and products.

### 5. Normalize the visual system and responsive states

- Reuse and minimally extend existing tokens for content width, spacing rhythm, type scale,
  radii, shadows, and motion.
- Give product and category cards consistent media regions; contain packshots and crop only
  editorial images with verified focal composition.
- Design separate grid and stacking rules for desktop, tablet, and mobile; verify long French
  copy and 200% text size.
- Preserve visible focus, logical source order, 44 px minimum touch targets where practical,
  useful alternative text, decorative-image silence, and no color-only meaning.
- Audit normal text at 4.5:1 minimum contrast and large text at 3:1 minimum, including buttons,
  links, focus indicators, and interactive states.

### 6. Preserve behavior and prove release readiness

- Keep the shared component loader, cart events, search form, mobile menu, modal focus trap,
  product destinations, and WhatsApp actions intact.
- Extend `scripts/verify-site.js` with homepage assertions for curated IDs/fallbacks, category
  destinations, removed filter dependency, required image attributes, and section presence.
- Run the build and baseline test suite, then complete the contract scenarios in
  `quickstart.md` using representative desktop/tablet/mobile viewports.
- Compare final desktop/mobile Core Web Vitals with the recorded baseline and required good
  thresholds; release fails if any metric regresses or exceeds its threshold.

## Post-Design Constitution Re-check

- Design artifacts add no new application, route, persistence layer, API, or dependency.
- Existing catalogue and taxonomy remain authoritative; homepage entities are projections only.
- The UI contract makes image integrity, responsive composition, accessibility, and regression
  protection explicit.
- The validation guide includes both automated checks and required visual/interaction evidence.

Result: **PASS**. No complexity waiver is needed.
