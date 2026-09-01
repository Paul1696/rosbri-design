# Homepage UI Contract

## Global contract

- The existing URLs `index.html`, `boutique.html`, `collections.html`, `produit.html?id=<id>`,
  `a_propos.html`, and existing WhatsApp destinations remain valid.
- Shared header, mobile menu, cart drawer, footer, customization modal, search, and catalogue
  behavior remain operational.
- No account, wishlist, sorting, or unsupported business capability is exposed.
- The document has no horizontal page overflow from 320–1440 px or at 200% text enlargement.
- Normal text meets 4.5:1 minimum contrast and large text meets 3:1 minimum contrast, including
  applicable buttons, links, focus indicators, and interactive states.
- Measured desktop/mobile performance meets LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1 without
  regression from the recorded pre-change baseline.

## Hero contract

- Exactly one primary CTA leads to `boutique.html` or its established catalogue equivalent.
- The existing customization modal may remain as one subordinate secondary action.
- Essential copy and CTAs remain visible before and after images load.
- Desktop/tablet use an art-directed optimized composition; mobile uses a simplified contained
  composition. Neither may visibly deform or unintentionally crop a product.
- Decorative imagery is ignored by assistive technology; meaningful product imagery has useful
  French alternative text.

## Featured-products contract

- Every card resolves from `ROSBriCatalog`; the homepage does not duplicate product truth.
- Every destination is `produit.html?id=<existing-id>`.
- Name, image, category, and price/quote state match the resolved catalogue record.
- All cards share a stable media proportion; packshots remain contained.
- A missing preferred product invokes a deterministic same-universe fallback.
- If the catalogue is unavailable, one accessible empty state links to `boutique.html`.
- Homepage filtering and sorting controls are absent.

## Product-universe contract

- Labels and destinations resolve from `ROSBriTaxonomy`.
- Only existing, active universes are shown.
- Consumer universes are visually discoverable; enterprise content remains in the dedicated B2B
  section.
- Each universe action reaches the matching filtered catalogue destination.

## Header and navigation contract

- Desktop retains brand, homepage, boutique, collections, about, B2B, search, and cart access.
- Mobile retains brand, menu access, search within the drawer, catalogue routes, and cart access.
- Keyboard focus order follows the visual reading order and every action has a visible focus
  indicator.

## Motion and interaction contract

- Hover feedback does not move essential content or change layout geometry.
- Essential behavior works without hover.
- Reduced-motion preference removes non-essential reveal and movement effects.
- Touch targets remain usable and do not overlap at supported mobile sizes.

## Regression contract

- Existing add-to-cart actions continue to update and open the cart correctly.
- Search submits the existing `recherche` query to the boutique.
- Mobile menu and cart drawer open, trap/restore focus where currently supported, and close.
- Customization modal opens, closes, restores focus, and preserves its WhatsApp submission flow.
- FAQ disclosure behavior and existing outbound links remain functional.
