# Site structure overhaul: Home, About, and index pages

Date: 2026-09-18
Status: Approved, ready for implementation planning

## Problem

Most Anthropy pages read as a flat stack of same-weight sections or, in
About's case, pure paragraphs top to bottom. Two pages already establish a
better model:

- **Leadership** (`src/pages/leadership.astro`) — tiered bento grid, current
  year vs. plain list for past years.
- **In2Academia** (`src/pages/in2academia.astro`) — stat bar, pillar grid,
  tag row, testimonial grid: several distinct visual rhythms in one page.

This spec extends that level of structural variety to the Homepage, About,
and the four index-style pages (Contact, Articles, Journal, Events), without
touching Leadership, In2Academia, or the long-form article/journal/event
detail pages (paragraphs are the right shape for a research paper — those
stay as `ProseLayout` prose, unchanged).

## Non-goals

- No new photography is sourced as part of this work. Image slots are built
  and styled (placeholder background treatment) so real photos can drop in
  later without further layout changes.
- No content-collection schema changes — this is layout/structure, not data
  model.
- No changes to Leadership or In2Academia pages.
- No changes to article/journal/event **detail** pages.

## 1. Homepage (`src/pages/index.astro`)

Current: thesis block → `ProofBand` → `CollectionGrid` (articles) →
`CollectionGrid` (journal) → 2-column plain-text programmes grid. All
sections share the same visual weight, which is the flatness problem.

New structure, top to bottom:

1. **Asymmetric hero.** Two-column layout (~60/40): h1 + lede in the wider
   column (unchanged copy/markup for the text itself), an image slot
   (`.hero-figure`) in the narrower column. The image slot is not empty
   space — style it with a sage/rust gradient or soft-tone wash consistent
   with the token palette, sized and cropped as if a photo already occupies
   it, so the page doesn't look broken before a real photo is added.
2. **`ProofBand`** — unchanged, no changes needed.
3. **Editorial work band** — replaces the two stacked `CollectionGrid`
   sections ("Recent work" and "The journal") with one asymmetric band:
   - Wide column: the single most recent article, styled larger (bigger
     title type, summary shown in full, discipline/date meta prominent) —
     a "featured" treatment, not a grid card.
   - Narrow column: the remaining recent articles as a compact stacked list
     (title + meta only, no summary), plus the latest journal issue(s)
     below that list, visually separated by a rule.
   - This band needs a new small presentational component (see
     "Components" below) rather than reusing `CollectionGrid`, since the
     item shapes differ (featured vs. compact-list).
4. **"What we run" bento pair.** Replaces the current plain 2-column
   `auto-grid` of bare `<article>` text with two unequal tiles reusing the
   Leadership `.tile`-style visual language (border, radius, tinted
   background per tile) — In2Academia tile larger/first, Humanities Focus
   tile smaller/second. Each tile links to its page; Humanities Focus tile
   keeps the "Next: {date}" line when an upcoming event exists.
5. **Closing stat strip.** New, small, single-row stat band (reusing the
   visual pattern of In2Academia's `.stats` — value + label pairs) closing
   the page: e.g. papers published count, journal issues count, campuses
   reached. Values are derived from existing collections at build time
   (article count, issue count) plus any static figures already available
   in `site.json` — no new data source required beyond what's already
   queried on this page. If a count is zero, that stat is omitted rather
   than shown as "0" (consistent with the site's existing empty-state
   philosophy).

## 2. About (`src/pages/about.astro`, via `ProseLayout`)

Current: header, then five `<p>`/`<h2>` blocks straight down one column,
including a "What we are not" section built around a `RevisionReveal`
("a small think tank" → "not a think tank").

Decision from review: **drop "What we are not" entirely.** The page should
not sell itself short by leading with a negative framing. The defensible,
non-braggadocious pitch is that Anthropy fosters early intellectual
curiosity — let the work (journal, articles, programmes) carry the rest.

New structure:

1. Header — unchanged (`eyebrow`, `h1` via `ProseLayout` props).
2. **Opening statement.** The existing first two paragraphs, tightened
   around "fostering early intellectual curiosity" rather than the current
   "distance between interest and doing research" framing — kept modest,
   not promotional. Laid out two-column: text in the prose measure, an
   image slot beside it (same placeholder-wash treatment as the homepage
   hero figure, smaller).
3. **Fact strip.** New, reusing the In2Academia `.stats` pattern: Est.
   `{site.established}`, based-at campus (`{site.basedAt}`), and one more
   fact already available in `site.json`/copy (e.g. contributor campuses).
   Pulled out of the prose column as a bordered row, breaking the page
   rhythm before "What we do."
4. **"What we do" bento pair.** Same two-tile pattern as the homepage's
   "What we run" (In2Academia / Humanities Focus), giving About and Home a
   visually related but not identical treatment of the same two
   programmes.
5. **Closing line.** One short, quiet paragraph — the journal exists so the
   work is taken seriously and speaks for itself. No pull-quote treatment,
   no "what we're not" framing, no `RevisionReveal` effect on this page.
   Plain prose, matching the page's understated close.

`RevisionReveal` is dropped entirely from About as a consequence of cutting
the "what we are not" section — it stays as a component (still used on the
homepage thesis block) but About no longer uses it.

## 3. Contact, Articles, Journal, Events — lighter structural variation

These pages already avoid pure paragraphs (card grids via `CollectionGrid`
or `auto-grid`), so this is a lighter pass: give each page one
distinguishing structural beat rather than a full rebuild, using a single
consistent motif — **one featured/larger item, remaining items in a plainer
list** — the same idea already validated by Leadership's
current-year-bento-vs-past-years-plain-list split.

- **Articles** (`src/pages/articles/index.astro`): the single most recent
  article gets a featured treatment (larger type, full summary shown) above
  the existing `CollectionGrid` of the rest.
- **Journal** (`src/pages/journal/index.astro`): the latest issue gets a
  featured treatment (larger block, cover-style presence) above the
  existing grid of older issues.
- **Events** (`src/pages/events/index.astro`): the "Next" event (already
  its own section) gets the featured treatment instead of using the same
  `CollectionGrid` card sizing as "Previously" — the one thing visitors
  most want to see should look different from the historical list.
- **Contact** (`src/pages/contact.astro`): smaller polish, not structural —
  the `.how` block (email + socials) gets more visual presence: email as a
  standalone large-display statement, socials as a distinct row below a
  rule, instead of both crammed into one small div. The 3-route grid stays
  as is.

The homepage's own featured-article treatment (section 1.3 above) and these
pages' featured-item treatment should share the same visual pattern/styling
approach (ideally the same small component — see below) so "featured" reads
as one consistent site-wide idea, not a one-off per page.

## Components

- **New: `FeaturedItem.astro`** (or similar) — a presentational component
  for "one larger/featured entry" taking a single item (`href`, `title`,
  `meta`, `summary`, and an optional badge/eyebrow like "Latest issue" /
  "Next"). Used by: Homepage editorial band, Articles index, Journal index,
  Events index ("Next"). Keeps the featured styling in one place rather
  than four copies of similar CSS.
- **`CollectionGrid.astro`** — unchanged, keeps serving the "plainer list"
  half of each page.
- **Image slot pattern** — a small shared CSS pattern (not necessarily a
  component, could be a `.figure-slot` utility class in `global.css` or
  scoped per-page) for the placeholder-wash treatment used by the Home hero
  and About opening statement. Both just need a styled empty `<div>`/`<figure>`
  today; swapping in a real `<img>` later shouldn't require structural
  changes.
- **Bento tile motif** — the Home "What we run" pair and About "What we do"
  pair reuse Leadership's `.tile` visual language (border, radius, tinted
  background) but not its interactive typewriter-reveal script — these are
  static, simpler two-tile layouts, not the tiered hover/focus system.
  Implementation should extract just the visual tile styling (border,
  radius, background tint, padding rhythm) as shared CSS custom properties
  or a small reusable class, not literally copy Leadership's `.bento`/`.tile`
  markup wholesale (that pattern is sized for its 6-column tiered grid,
  which doesn't fit a 2-tile layout).

## Content changes

- About's copy needs editing as part of this work (not just layout): the
  opening statement reframed around fostering early intellectual curiosity,
  and the "What we are not" section's text removed rather than just its
  visual treatment. Exact final copy is an implementation-time writing
  task, not fully specified here — the spec fixes structure and tone
  (modest, not promotional), not exact sentences.
- Homepage's closing stat strip figures come from data already fetched on
  that page (article/issue counts) plus existing `site.json` fields — no
  new figures need to be invented or sourced.

## Testing

- Existing e2e smoke test (`tests/e2e`, "every page has exactly one h1")
  must continue to pass — none of these changes add or remove the page
  `<h1>`.
- Manually verify each changed page at the existing responsive breakpoint
  behavior (`auto-grid` and the site's `@media (max-width: 720px)` pattern
  used elsewhere) — new bento pairs and featured/list splits need to
  collapse to single-column on narrow viewports, consistent with how
  Leadership's bento already does this.
- Verify empty states still work: homepage stat strip omits zero-value
  stats; Articles/Journal/Events featured treatment gracefully falls back
  (matching each page's existing `emptyMessage` handling) when a collection
  is empty rather than crashing on an undefined "latest" item.
- Run existing unit tests (`vitest.config.ts` / `tests/unit`) — no schema
  changes expected to break them, but confirm.

## Out of scope / explicitly deferred

- Leadership, In2Academia: untouched.
- Article/Journal/Event detail pages: untouched (prose is correct there).
- Real photography: deferred, image slots only.
- 404 page: untouched.
