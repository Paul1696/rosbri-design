<!--
Sync Impact Report
- Version change: unratified template -> 1.0.0
- Modified principles:
  - Template Principle 1 -> I. Brand Identity and Premium Editorial Direction
  - Template Principle 2 -> II. Responsive Composition and Image Integrity
  - Template Principle 3 -> III. Preserve the Existing Product
  - Template Principle 4 -> IV. Reusable, Coherent Implementation
  - Template Principle 5 -> V. Performance and Inclusive Quality
- Added sections:
  - Visual and Image Constraints
  - Implementation Workflow and Quality Gates
- Removed sections: none; template sections were concretized
- Follow-up TODOs: none
-->

# Rosbri Design Constitution

## Core Principles

### I. Brand Identity and Premium Editorial Direction
Every user-facing change MUST preserve Rosbri Design as an African-inspired fashion,
textile, accessories, and lifestyle brand. Visual work MUST be elegant, contemporary,
premium, and subtly informed by African aesthetics without becoming ornamental or
stereotyped. Layouts MUST favor generous whitespace, strong hierarchy, and clean editorial
composition over generic marketplace patterns. Visual clutter, redundant controls, and
elements that do not improve shopping MUST be removed or omitted. A `Sort by` control MUST
NOT be introduced unless an approved feature specification explicitly requires it.

Rationale: a distinctive and disciplined brand experience is the primary product goal and
must guide every design decision.

### II. Responsive Composition and Image Integrity
All layouts MUST be intentionally responsive across mobile, tablet, and desktop; breakpoints
MUST adapt composition and interaction rather than merely scale the desktop layout. Mobile
shopping quality is a first-class acceptance criterion. Images MUST retain their intrinsic
aspect ratio and MUST NOT be stretched, squashed, or unintentionally cropped. Product
packshots SHOULD use `object-fit: contain`; editorial photography MAY use `object-fit: cover`
only when the intended composition remains intact. Promotional product objects MUST retain
breathing room inside their background and MUST NOT touch container edges unless the approved
design explicitly calls for it. Transparent PNG assets MUST remain clean and correctly
positioned.

Rationale: responsive composition and faithful product imagery directly affect trust,
perceived quality, and purchase confidence.

### III. Preserve the Existing Product
Rosbri Design is an existing, production-oriented application. Work MUST extend and polish the
current implementation rather than rebuild it from scratch. The existing stack, routes, APIs,
database structures, business logic, and functioning features MUST be preserved unless a
documented technical necessity or approved feature specification requires a change. Any
destructive refactor or stack replacement MUST include a written justification, migration
impact, regression risks, and a safer-alternative assessment before implementation.

Rationale: protecting proven behavior and production continuity takes precedence over
unnecessary architectural novelty.

### IV. Reusable, Coherent Implementation
Existing components MUST be inspected and reused when they already fulfill the required
responsibility. Components with the same responsibility MUST NOT be duplicated; variations
SHOULD be expressed through configuration. Shared spacing, typography, colors, radii, card
geometry, and component proportions MUST come from common tokens or configuration rather than
duplicated hardcoded values. Reusable design-system styles MUST remain separate from
page-specific styles. Changes MUST be the smallest coherent implementation that satisfies the
approved specification. New dependencies MUST be justified by a clear need that existing code
or platform capabilities cannot reasonably meet.

Rationale: a compact reusable system keeps the brand consistent and reduces regression and
maintenance costs.

### V. Performance and Inclusive Quality
Changes MUST preserve or improve Core Web Vitals and MUST prevent avoidable layout shifts.
Images MUST be appropriately sized and optimized; non-critical imagery SHOULD be lazy-loaded.
Client-side JavaScript MUST be limited to behavior that materially improves the experience.
Animations MUST be subtle, premium, performant, and SHOULD favor `transform` and `opacity`.
Hover effects MUST enhance perceived quality without distracting from shopping and MUST NOT be
the only way to access essential behavior. Text and controls MUST maintain readable contrast,
interactive elements MUST expose clear states, keyboard navigation MUST remain usable, and
meaningful images MUST have appropriate alternative text. Essential information MUST NOT be
communicated by color alone.

Rationale: premium quality includes speed, stability, clarity, and access for all users.

## Visual and Image Constraints

- Spacing, typography, border radii, cards, and component proportions MUST be consistent across
  the website and traceable to shared design tokens where applicable.
- Product and promotional compositions MUST provide deliberate negative space; oversized
  objects touching container boundaries require an explicit design rationale.
- Decorative assets MUST NOT be accidentally cropped at any supported viewport.
- CSS image dimensions MUST either preserve intrinsic ratio or be paired with an appropriate
  `object-fit` strategy that satisfies the intended composition.
- Desktop, tablet, and mobile states MUST each be visually reviewed for hierarchy, image
  integrity, overflow, and interaction usability.
- Motion MUST respect reduced-motion preferences when animation is not essential.

## Implementation Workflow and Quality Gates

Before changing an existing page, the implementer MUST:

1. Inspect the current markup, styles, scripts, behavior, and responsive states.
2. Identify reusable components, shared tokens, and existing business logic.
3. Record likely regressions, including navigation, cart, catalog, imagery, layout, and
   accessibility risks relevant to the change.
4. Preserve functioning behavior and implement the smallest coherent change.
5. Verify affected desktop, tablet, and mobile states, including image aspect ratio, keyboard
   operation, layout stability, and critical shopping interactions.

Feature specifications MUST distinguish business requirements from design or technical
assumptions. Ambiguities MUST be surfaced during specification or clarification and MUST NOT be
silently resolved by inventing business requirements. Reviews MUST explicitly check compliance
with this constitution and document any exception with its rationale, scope, and remediation
plan.

## Governance

This constitution is the highest project-level authority for specifications, plans, tasks,
implementation, and review. Conflicting guidance MUST be reconciled in favor of this document
unless the constitution is formally amended.

Amendments MUST be documented in this file with an updated Sync Impact Report, a semantic
version increment, and the date of amendment. Versioning follows these rules:

- MAJOR: removes or redefines a principle in a backward-incompatible way.
- MINOR: adds a principle or materially expands governance or mandatory constraints.
- PATCH: clarifies wording without changing required behavior.

Every feature specification and implementation plan MUST include a constitution compliance
check. Every implementation review MUST verify applicable visual, responsive, behavioral,
performance, and accessibility gates. Exceptions require explicit approval and MUST document
why compliance is currently impossible, the bounded impact, and the intended remediation.

**Version**: 1.0.0 | **Ratified**: 2026-08-17 | **Last Amended**: 2026-08-17
