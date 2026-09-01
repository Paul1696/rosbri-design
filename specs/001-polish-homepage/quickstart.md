# Quickstart Validation: Polish Rosbri Design Homepage

## Prerequisites

- Node.js and npm installed
- Python 3 available for the local static server
- Repository root: `E:\ROSBRI DESIGN`

## Build and structural checks

```powershell
npm.cmd run build
npm.cmd test
```

Expected: the local CSS and SEO build completes, all catalogue images referenced by data exist,
all canonical categories remain valid, and homepage structural/regression assertions pass.

## Start the site

```powershell
npm.cmd run serve
```

Open `http://127.0.0.1:4173/index.html`.

## Visual viewport matrix

Review the complete page at these representative viewport widths:

| Profile | Width | Expected result |
|---------|-------|-----------------|
| Desktop | 1440 px | Editorial hero balance, concise hierarchy, stable grids |
| Tablet landscape | 1024 px | Intentional two-column/compact arrangements without crowding |
| Tablet portrait | 768 px | Deliberate transition between desktop and mobile composition |
| Mobile | 390 px | Legible hero, contained product visual, usable stacked sections |
| Small mobile | 320 px | No overlap, clipping, or horizontal page overflow |

At every width verify:

1. No product or editorial image is visibly stretched, squashed, or accidentally cropped.
2. Hero text and CTAs remain readable and visually dominant.
3. Category and product cards use consistent proportions and spacing.
4. Product names, prices, images, and destinations match the existing catalogue.
5. Late-loading images do not cause disruptive layout movement.

Run the same documented performance measurement procedure before implementation and after the
final build on desktop and mobile. Record LCP, INP, and CLS. The final result must meet LCP ≤
2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1 without worsening any metric from baseline.

## Interaction validation

1. Activate the primary hero CTA and confirm arrival at the boutique.
2. Open and close the customization modal; verify Escape, backdrop, close button, focus entry,
   and focus restoration.
3. Use header search and confirm the boutique receives the search query.
4. Open and close the mobile menu and cart drawer.
5. Add a priced featured product to the cart and verify count, item, total, and WhatsApp order
   path. For quote-only products, verify the direct WhatsApp action.
6. Open every displayed category and featured-product destination.
7. Exercise FAQ disclosures and supporting editorial/B2B links.

Expected behavior is defined in [homepage-ui-contract.md](contracts/homepage-ui-contract.md).

## Accessibility and resilience validation

- Navigate from the skip link through all homepage actions using only the keyboard.
- Confirm visible focus states and logical focus order.
- Measure text and interactive-state contrast: normal text must be at least 4.5:1 and large text
  at least 3:1, including text placed over hero/editorial imagery.
- Increase text to 200% and repeat the 320 px and 768 px checks.
- Enable reduced motion and confirm reveal effects no longer create unnecessary movement.
- Disable or delay images and verify meaningful alternative text and stable media regions.
- Confirm information and interactive states are not communicated by color alone.

## Release evidence

Capture final screenshots at 1440×900, 1024×768, and 390×844. Record automated test output and
any intentional visual tradeoff. Release is ready only when all success criteria in
[spec.md](spec.md) and every contract above pass without a constitution exception.
