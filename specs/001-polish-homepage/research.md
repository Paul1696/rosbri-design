# Research: Polish Rosbri Design Homepage

## Decision 1: Preserve the static-site architecture

**Decision**: Improve the existing HTML, CSS, and vanilla JavaScript implementation in place.

**Rationale**: The site already has shared components, a 467-item catalogue, canonical taxonomy,
cart behavior, search, mobile navigation, product routes, and a passing verification suite.
Replacing the stack would add migration risk without addressing the visual objective.

**Alternatives considered**:

- Rebuild with a component framework: rejected because it duplicates working behavior and
  violates the brownfield constraint.
- Create a separate homepage application: rejected because it fragments shared navigation,
  cart state, catalogue truth, and deployment.

## Decision 2: Consolidate the homepage CSS override chain

**Decision**: Make `css/home.css` the authoritative homepage stylesheet and retire
`css/home-redesign.css` after migrating only still-valid declarations and verifying parity.

**Rationale**: The current override layer contains repeated and contradictory hero rules,
including `contain`, `cover`, and `fill` strategies plus repeated composition visibility rules.
One ordered stylesheet reduces distortion risk and makes breakpoint intent auditable.

**Alternatives considered**:

- Add another override file: rejected because it compounds precedence and maintenance risk.
- Rewrite all global CSS: rejected because the feature is homepage-scoped and shared pages are
  currently functional.

## Decision 3: Use the optimized composite hero on desktop

**Decision**: Use the existing optimized premium 21:9 hero composite for desktop/tablet and a
simplified, contained product composition for mobile.

**Rationale**: The optimized composite is about 346 KB, while the available independent PNG
layers collectively add several megabytes. The composite provides controlled art direction and
breathing room without risking random overlap. Mobile needs a distinct composition to protect
copy and CTAs.

**Alternatives considered**:

- Load all interactive product layers on desktop: rejected because of payload, overlap, and
  responsive maintenance cost.
- Use one cropped background at every size: rejected because mobile readability and product
  integrity require a separate composition.

## Decision 4: Curate featured products deterministically

**Decision**: Allow a curated set of existing product IDs across active categories, with a
deterministic category fallback if a configured item is unavailable. The user explicitly
approved formalizing this remediation on 2026-08-17.

**Rationale**: The current weekly arithmetic rotation makes art direction unstable and renders
many hidden cards. Deterministic curation supports consistent visual quality while catalogue
fallbacks prevent empty sections. This applies the recommended unresolved clarification without
changing catalogue data or business rules.

**Alternatives considered**:

- Keep weekly rotation: rejected because visual QA cannot guarantee a consistently premium mix.
- Hardcode full product records in the homepage: rejected because it duplicates names, prices,
  images, and routes.
- Preserve the exact current highlighted IDs: rejected because the user requested professional
  curation and did not constrain selection to the current mix.

## Decision 5: Remove homepage product filters

**Decision**: Show a concise curated selection and route broader browsing to the existing
catalogue; remove the homepage filter controls and their page-specific behavior.

**Rationale**: Filters add control density to a landing page, hide most pre-rendered cards, and
duplicate catalogue discovery. The constitution explicitly rejects unnecessary controls.

**Alternatives considered**:

- Keep all five filters: rejected because the catalogue and universe cards already provide
  deeper category navigation.
- Add sorting: rejected by the constitution and feature specification.

## Decision 6: Reuse canonical taxonomy and shared components

**Decision**: Derive category labels and destinations from `ROSBriTaxonomy` and retain existing
shared header, mobile menu, cart drawer, footer, and their loader fallbacks.

**Rationale**: Six canonical universes and their aliases already exist. Header search and cart
are supported; account and wishlist are not, so they must not be invented.

**Alternatives considered**:

- Create homepage-only category definitions: rejected because they can drift from catalogue
  routes and labels.
- Add account or wishlist affordances: rejected because no corresponding capability exists.

## Decision 7: Validate with automated and visual evidence

**Decision**: Extend the existing Node verification suite and perform browser checks at 1440,
1024, 768, 390, and 320 px, plus keyboard, reduced-motion, and 200% text review.

**Rationale**: Structural checks protect routes and data integrity, while the feature's image,
hierarchy, and responsive outcomes require rendered visual evidence.

**Alternatives considered**:

- Rely only on screenshots: rejected because screenshots do not prove cart, keyboard, modal,
  search, or destination behavior.
- Rely only on static tests: rejected because distortion and art direction are visual outcomes.

## Decision 8: Use measurable accessibility and performance release gates

**Decision**: Require WCAG 2.2 Level AA minimum contrast (4.5:1 normal text, 3:1 large text) and
good Core Web Vitals thresholds (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1), with no regression from
the recorded desktop/mobile baseline.

**Rationale**: The constitution makes readable contrast and preserved Core Web Vitals mandatory.
Explicit thresholds turn those principles into repeatable release decisions.

**Alternatives considered**:

- Visual judgment alone: rejected because it cannot reliably establish contrast or performance.
- Compare only with baseline: rejected because an already-poor baseline would remain acceptable.
- Check only thresholds: rejected because a passing metric could still materially regress.
