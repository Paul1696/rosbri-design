# CSS consolidation

`css/home.css` is now the single homepage-specific source. The retired `home-redesign.css` is no longer loaded. Rules are ordered as foundations, hero, products, universes, editorial sections, interactions and responsive states. Conflicting hero sizing, repeated card overrides and fill-based image deformation were removed. Shared tokens remain in `css/tokens.css`.

Post-consolidation regression result: 467 products passed the automated site suite.

