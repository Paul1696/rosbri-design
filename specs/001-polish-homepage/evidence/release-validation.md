# Release validation

## Automated gates

- `npm.cmd run build`: passed; 467 SEO product pages and sitemap regenerated.
- `npm.cmd test`: passed; 467 catalogue products plus homepage contracts.
- Viewports 1440×900, 1024×768, 768×1024, 390×844 and 320×844: 4 product cards, 5 universe cards, no horizontal overflow.
- Modal, FAQ, routes, safe DOM rendering and reduced-motion contracts: passed.
- Static contrast pairs use black/cream or white/black combinations above WCAG AA; visible focus styling is retained. Image-backed hero text occupies a protected light region.

## Visual evidence

Final captures are in `evidence/final/` for all five target sizes. Compared with baseline, the hero is legible and art-directed, mobile contains the product object, discovery grids are consistent, and the page no longer presents duplicated homepage filters.

## Performance evidence and exceptions

Optimized card images are each below 170 KB and media dimensions are reserved to prevent layout shifts. A reliable local INP value requires a longer real interaction session, and the pre-change observer sample was unavailable; therefore numeric baseline/final Core Web Vitals comparison is not claimed. Field monitoring remains the correct release follow-up.

All functional and visual requirements are implemented. The only unmet measurable outcome is the external five-person SC-001 comprehension study; it is documented in `us1-hero.md` and must be completed by the project owner before claiming that research result.
