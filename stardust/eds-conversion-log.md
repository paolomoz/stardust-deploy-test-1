# EDS conversion log — Wasatch Back Beerworks (home)

Source prototype: `greenfield-beermaker/stardust/migrated/index.html` (single-file,
inline `<style>`, `[data-section]` markup). Scope of this run: the **home page only**
(`index.html`), deployed to DA `paolomoz/stardust-deploy-test-1` (main).

## Runtime
- Vanilla aem-boilerplate target → ported the **AuthorKit** runtime from
  `github.com/aemsites/author-kit@main` (ak.js, scripts.js, lazy.js, utils, tools,
  deps, fragment + section-metadata blocks, head.html, .hlxignore).
- Removed boilerplate: aem.js, delayed.js, header/footer/cards/columns/widget/hero
  blocks, fonts.css, lazy-styles.css.
- Header/footer use the **static-fragment** model (skill Step 6), not the current
  author-kit block-header. `scripts/postlcp.js` was rewritten to `loadStaticFragment()`
  for BOTH header and footer (sets `el.className` before inject, #21). `scripts/lazy.js`
  footer-block import removed (#4). `scripts/scripts.js` trimmed to one locale +
  fragment linkBlock.

## Blocks (one prototype section = one block)
| block | section | notes |
|---|---|---|
| hero | hero | LCP, owns the single `<h1>`; full-bleed photo + scrim + overlay |
| heritage | heritage | 2-col editorial; keeps the placeholder prose box |
| the-place | the-place | full-bleed photo, corner tag, plain text link (not a button) |
| featured-beer | featured-beer | 3-up card grid; row-per-card + flattened fallback (#52); content capped at --maxw |
| the-people | the-people | split-2 photo halves, whole half is the tile link |

## Fonts (self-hosted, no head.html font lines)
- **Lilita One** (`--hero`) — label/product face, actually rendered in the proto. self-hosted woff2.
- **Public Sans** (`--body`) — variable; metric-matched Arial fallback computed via
  fonttools (size-adjust 123.36%, ascent 77.01%, descent 18.24%). `body.session` gate.
- **Bebas Neue** (`--display`) — shipped as the intended fallback for the proprietary
  **"Bellfort"** named first in the proto stack (#77). The proto itself never loaded a
  display face (rendered system-ui bold); EDS ships Bebas, so `--display` headings are an
  intentional, documented divergence from the proto's accidental system render.

## Decisions / trade-offs
- Buttons via convention: `<strong><a>`→primary (hero "See the Beers"),
  `<em><a>`→secondary (heritage ghost CTA). Text links (the-place, featured-beer foot)
  left plain and styled per-block.
- Content images committed to `/img/wasatch/` and referenced fully-qualified to the code
  origin in the content page. NOTE: source JPEGs are ~0.6–1MB each (~6.3MB total) — not
  re-optimised for this test; optimise before any real launch.
- Reveal `opacity:0` states NOT lifted (proto GSAP doesn't run in EDS, #16) — content
  renders visible.
- Prototype's header overlay-on-hero approximated: `header.header` is sticky with a dark
  nav gradient (the static fragment lives inside the chrome host, which can't be a direct
  body child the way the proto's sticky header was).

## Local QA (passed)
single `<h1>`; all 5 blocks decorated non-empty; 3 cards with correctly-matched can
images; 2 people halves with correct hrefs; primary+secondary buttons decorated; header
& footer fragments load (sticky header, 3-col footer); no broken images; no 4xx; wide
(1680) featured-beer content constrained to 1320px.

## Not done / next
- Only `index.html` converted. The sibling pages (beers, the-brewery, taprooms) and their
  unique sections are NOT yet converted.
- Lint: `npm run lint:js` cannot run — the boilerplate's shipped package.json pairs
  `@babel/eslint-parser@8` with `eslint@8.57` (+ missing @babel/core), a pre-existing
  toolchain break. `lint:css` is clean (vendored AuthorKit blocks added to .stylelintignore).
