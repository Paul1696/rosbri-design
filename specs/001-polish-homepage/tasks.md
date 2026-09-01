# Tasks: Polish Rosbri Design Homepage

**Input**: Design documents from `/specs/001-polish-homepage/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/homepage-ui-contract.md`, `quickstart.md`

**Organization**: Tasks are grouped by user story so each story can be implemented and
validated as a coherent increment. The existing site, routes, catalogue, shared components,
cart, and WhatsApp behavior must remain operational throughout.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no incomplete-task
  dependency.
- **[Story]**: Maps the task to a user story in `spec.md`.
- Every task names the exact file or artifact it changes.

## Phase 1: Setup and Baseline

**Purpose**: Preserve evidence of the current production-oriented implementation before edits.

- [X] T001 Run `npm.cmd test` and document the passing 467-product baseline plus current branch in `specs/001-polish-homepage/evidence/baseline.md`
- [ ] T002 Capture current 1440×900, 1024×768, 768×1024, 390×844, and 320×844 screenshots plus repeatable desktop/mobile LCP, INP, and CLS baselines and index them in `specs/001-polish-homepage/evidence/baseline.md`
- [X] T003 [P] Inventory intrinsic dimensions, file sizes, transparency, and intended usage of `images/hero/` assets in `specs/001-polish-homepage/evidence/image-inventory.md`
- [X] T004 [P] Record the existing hero, search, mobile-menu, customization-modal, product-card, cart, FAQ, and WhatsApp behaviors that must survive in `specs/001-polish-homepage/evidence/behavior-baseline.md`

---

## Phase 2: Foundational Cleanup

**Purpose**: Remove conflicting homepage foundations before implementing any user story.

**⚠️ CRITICAL**: No user-story styling begins until the authoritative homepage CSS has been
established and the baseline checks still pass.

- [X] T005 Audit `css/home.css` and `css/home-redesign.css`, then annotate the retained selector groups and conflicting hero/card rules in `specs/001-polish-homepage/evidence/css-consolidation.md`
- [X] T006 Consolidate all still-valid homepage declarations into one ordered source in `css/home.css`, removing obsolete repeated overrides and every `object-fit: fill` image rule
- [X] T007 Remove the retired `css/home-redesign.css` stylesheet reference and normalize homepage stylesheet cache versions in `index.html`
- [X] T008 [P] Add only the missing shared spacing, media-ratio, focus, and motion tokens required by the plan to `css/tokens.css`
- [X] T009 Re-run `npm.cmd test` after CSS consolidation and record any baseline difference in `specs/001-polish-homepage/evidence/css-consolidation.md`

**Checkpoint**: One authoritative homepage stylesheet is active, no product image can inherit a
fill-based deformation rule, and the original structural regression suite still passes.

---

## Phase 3: User Story 1 — Understand the Brand and Enter the Catalogue (Priority: P1) 🎯 MVP

**Goal**: Deliver a professionally composed hero that immediately communicates the Rosbri
Design offer and provides a dominant catalogue action on desktop, tablet, and mobile.

**Independent Test**: Open only the initial homepage viewport at 1440, 1024, 768, 390, and
320 px; confirm that the offer and primary CTA are identifiable within five seconds, imagery is
undistorted with breathing room, mobile text is unobstructed, and the CTA opens `boutique.html`.

- [X] T010 [US1] Refine hero hierarchy, concise French messaging, meaningful/decorative image semantics, and one dominant catalogue CTA while preserving the customization modal trigger in `index.html`
- [X] T011 [US1] Implement one authoritative desktop and tablet hero composition using the optimized premium asset with stable intrinsic-ratio behavior in `css/home.css`
- [X] T012 [US1] Implement a distinct mobile hero composition with contained product imagery, protected text/CTA space, and no horizontal overflow in `css/home.css`
- [X] T013 [US1] Add subtle focus/hover behavior and reduced-motion-safe hero transitions without layout movement in `css/home.css`
- [X] T014 [P] [US1] Add automated hero contract assertions for primary CTA, image semantics, forbidden fill deformation, and required responsive classes in `scripts/verify-site.js`
- [ ] T015 [US1] Validate the US1 viewport/interaction contract and run the five-person first-view comprehension test required by SC-001, recording participants, timing, outcomes, and screenshots in `specs/001-polish-homepage/evidence/us1-hero.md`

**Checkpoint**: User Story 1 is independently deployable as the homepage MVP.

---

## Phase 4: User Story 2 — Discover Existing Product Universes (Priority: P2)

**Goal**: Make the active consumer universes easy to scan and open without inventing categories
or duplicating the dedicated enterprise journey.

**Independent Test**: Compare every displayed universe with `ROSBriTaxonomy` and live catalogue
content; verify accurate French labels, representative imagery, working filtered destinations,
responsive layouts, and no horizontal overflow.

- [X] T016 [US2] Replace hardcoded three-card universe content with a stable semantic mount and accessible fallback content in `index.html`
- [X] T017 [US2] Resolve active consumer universes, labels, representative existing products, and taxonomy-generated destinations in `js/home-products.js`
- [X] T018 [US2] Render universe cards safely with meaningful image text and omit empty universes without leaving blank slots in `js/home-products.js`
- [X] T019 [US2] Design editorial desktop, tablet, and mobile universe layouts with consistent media proportions in `css/home.css`
- [X] T020 [P] [US2] Add taxonomy, active-universe, destination, and empty-universe assertions in `scripts/verify-site.js`
- [X] T021 [US2] Validate every displayed universe destination, responsive state, and maximum two-action path required by SC-009 and record action counts/results/screenshots in `specs/001-polish-homepage/evidence/us2-universes.md`

**Checkpoint**: User Story 2 works independently using only supported catalogue universes.

---

## Phase 5: User Story 3 — Evaluate Featured Products and Collections (Priority: P2)

**Goal**: Present a compact, stable, premium cross-category product selection with accurate
catalogue data and consistent cards.

**Independent Test**: Load the homepage with the current catalogue and with one preferred item
made unavailable; verify deterministic same-universe fallback, accurate product data, contained
images, working product/cart/WhatsApp actions, and a usable empty-catalogue state.

- [X] T022 [US3] Remove homepage filter controls from the featured-products section and strengthen the catalogue continuation action in `index.html`
- [X] T023 [US3] Replace weekly pseudo-random rotation with ordered preferred product IDs and deterministic taxonomy fallbacks in `js/home-products.js`
- [X] T024 [US3] Render only the compact curated selection with accurate title, category, price/quote, image, destination, cart, and WhatsApp data in `js/home-products.js`
- [X] T025 [US3] Remove obsolete filter behavior and timeout-based card hiding while preserving FAQ, modal, and reveal behavior in `js/main.js`
- [X] T026 [US3] Normalize featured-card media regions, whitespace, typography, actions, focus, and non-shifting hover feedback across breakpoints in `css/home.css`
- [X] T027 [P] [US3] Add curated-ID, deterministic-fallback, no-filter, empty-state, product-route, and card-data assertions in `scripts/verify-site.js`
- [X] T028 [US3] Validate priced and quote-only cards, fallback behavior, maximum two-action product paths required by SC-009, cart updates, and responsive visuals in `specs/001-polish-homepage/evidence/us3-featured-products.md`

**Checkpoint**: User Story 3 works independently and no homepage control duplicates catalogue
filtering.

---

## Phase 6: User Story 4 — Experience a Coherent Premium Homepage (Priority: P3)

**Goal**: Complete the page-wide editorial rhythm, brand story, navigation continuity,
accessibility, and deliberate responsive experience.

**Independent Test**: Review the complete homepage at all target viewports and with keyboard,
200% text, and reduced motion; verify coherent section rhythm, concise brand messaging, usable
shared navigation, stable shopping paths, and no unsupported controls.

- [X] T029 [US4] Tighten section order, repeated messaging, brand-story copy, and supporting customization/B2B/FAQ/social content without removing working actions in `index.html`
- [X] T030 [US4] Normalize homepage content widths, vertical rhythm, typography hierarchy, button treatment, card geometry, and editorial image composition in `css/home.css`
- [X] T031 [US4] Implement deliberate tablet/mobile stacking, long-French-copy handling, 200% text resilience, and 320 px overflow protection in `css/home.css`
- [X] T032 [US4] Make reveal behavior conditional on reduced-motion preference and preserve logical content visibility without animation in `js/main.js`
- [X] T033 [P] [US4] Audit and correct shared desktop navigation, search, cart access, and visible focus requirements in `components/header.html`, recording each result in `specs/001-polish-homepage/evidence/us4-coherence.md`
- [X] T034 [P] [US4] Audit and correct mobile search, catalogue routes, cart access, and touch-target requirements in `components/mobile-menu.html`, recording each result in `specs/001-polish-homepage/evidence/us4-coherence.md`
- [X] T035 [US4] Mirror every confirmed T033/T034 shared-component correction in the embedded header/mobile fallbacks in `js/components.js`, or record that no fallback change was required in `specs/001-polish-homepage/evidence/us4-coherence.md`
- [X] T036 [P] [US4] Add page-order, unsupported-control, accessibility-attribute, and reduced-motion assertions in `scripts/verify-site.js`
- [X] T037 [US4] Validate the full US4 contract and record keyboard, 200% text, reduced-motion, responsive, and navigation evidence in `specs/001-polish-homepage/evidence/us4-coherence.md`

**Checkpoint**: All four user stories are complete and independently verifiable.

---

## Phase 7: Polish and Cross-Cutting Release Gates

**Purpose**: Prove performance, image integrity, regression safety, and release readiness across
the completed homepage.

- [X] T038 [P] Audit all homepage image source files, intrinsic dimensions, loading priority, lazy-loading, decoding, and reserved media regions in `specs/001-polish-homepage/evidence/final-image-audit.md`
- [X] T039 Optimize loaded homepage rasters over 300 KB or encoded above twice their maximum rendered dimensions under `images/hero/` and `images/articles-site/`, preserve source masters, and document derivative paths plus before/after bytes in `specs/001-polish-homepage/evidence/final-image-audit.md`
- [ ] T040 Run `npm.cmd run build` and `npm.cmd test`, then measure final desktop/mobile LCP, INP, and CLS against both baseline and the 2.5 s/200 ms/0.1 thresholds and record complete results in `specs/001-polish-homepage/evidence/release-validation.md`
- [ ] T041 Execute every interaction/accessibility scenario in `specs/001-polish-homepage/quickstart.md`, including 4.5:1 normal-text and 3:1 large-text contrast audits for buttons, links, focus, and interactive states, and record pass/fail evidence in `specs/001-polish-homepage/evidence/release-validation.md`
- [X] T042 Capture final 1440×900, 1024×768, 768×1024, 390×844, and 320×844 screenshots and compare them with baseline in `specs/001-polish-homepage/evidence/release-validation.md`
- [X] T043 Verify all requirements and measurable outcomes in `specs/001-polish-homepage/spec.md`, documenting any unmet criterion or approved exception in `specs/001-polish-homepage/evidence/release-validation.md`
- [X] T044 Update completed task markers and summarize delivered files, preserved behaviors, test results, and remaining risks in `specs/001-polish-homepage/tasks.md`

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 — Setup**: Starts immediately; T001/T002 share one evidence file and run sequentially,
  while T003 and T004 can run in parallel.
- **Phase 2 — Foundation**: Depends on Phase 1 and blocks every user story.
- **Phase 3 — US1**: Depends on Phase 2 and is the MVP.
- **Phase 4 — US2**: Depends on Phase 2; may begin after the CSS foundation is stable.
- **Phase 5 — US3**: Depends on Phase 2 and on T017–T018 because US2 and US3 share
  `js/home-products.js`.
- **Phase 6 — US4**: Depends on desired US1–US3 content being stable because it normalizes the
  complete page rhythm.
- **Phase 7 — Release**: Depends on all selected user stories.

### User Story Dependency Graph

```text
Setup → Foundation → US1 (MVP)
                   ├→ US2 → US3
                   └────────────→ US4
US1 + US2 + US3 + US4 → Release Gates
```

### User Story Independence

- **US1**: Can ship after Foundation with no dependency on product grids or editorial sections.
- **US2**: Can be tested with universe discovery alone after Foundation.
- **US3**: Uses the shared renderer introduced by US2, but its product selection and shopping
  paths have their own independent acceptance test.
- **US4**: Can be reviewed as a complete page-coherence layer after any chosen preceding stories;
  its shared-component checks remain isolated from catalogue data.

## Parallel Execution Examples

### Setup

```text
Task T003: Inventory images/hero/ in evidence/image-inventory.md
Task T004: Record behavior baseline in evidence/behavior-baseline.md
```

### User Story 1

```text
After T010–T013 establish the hero contract:
Task T014: Add hero assertions in scripts/verify-site.js
Task T015: Prepare viewport evidence in evidence/us1-hero.md
```

### User Story 2

```text
After T016–T019 establish universe behavior:
Task T020: Add taxonomy assertions in scripts/verify-site.js
Task T021: Validate destinations and screenshots in evidence/us2-universes.md
```

### User Story 4

```text
Task T033: Verify components/header.html
Task T034: Verify components/mobile-menu.html
Task T036: Add page/accessibility assertions in scripts/verify-site.js
```

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational cleanup.
2. Implement US1 only.
3. Run T014–T015 and stop for hero review.
4. The site remains deployable because all existing shopping behavior is preserved.

### Incremental Delivery

1. **MVP**: Stable premium hero and catalogue entry.
2. **Discovery**: Active canonical product universes.
3. **Merchandising**: Deterministic premium featured selection.
4. **Coherence**: Complete editorial and responsive normalization.
5. **Release**: Build, regression, accessibility, performance, and visual evidence.

### Risk Controls

- Do not edit catalogue schema, routes, cart storage, or business rules.
- Update shared component source and embedded fallback together only when a correction is needed.
- Run `npm.cmd test` after the CSS foundation and after every story that changes catalogue or
  navigation behavior.
- Preserve source image masters when creating optimized derivatives.
- Stop at each checkpoint if image distortion, horizontal overflow, or shopping regression is
  detected.

## Notes

- `[P]` tasks touch different files or evidence artifacts and can run concurrently once their
  stated prerequisites are complete.
- Story labels map directly to `spec.md` for traceability.
- No new framework, API, database, account system, wishlist, or sorting control is authorized.
- The unresolved clarification was handled using the plan's reversible default: curated product
  IDs may change, but every item must already exist in the catalogue.
