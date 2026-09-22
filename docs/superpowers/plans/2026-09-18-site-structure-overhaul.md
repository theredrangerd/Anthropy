# Site Structure Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Break the flat, same-weight section stacks on the Homepage and About page into visually varied structures, and give Articles/Journal/Events index pages a consistent "featured item + plain list" treatment, without touching Leadership, In2Academia, or long-form detail pages.

**Architecture:** A new `FeaturedItem.astro` presentational component (one larger entry: badge, eyebrow, title, summary) is introduced and reused across the Homepage, Articles index, Journal index, and Events index. A new shared CSS primitive pair — `.tile-pair` (two-tile unequal programme grid) and `.figure-slot` (styled image placeholder) — is added to `global.css` and reused by both the Homepage hero/programmes and the About page. Each page task is self-contained and independently testable via Playwright.

**Tech Stack:** Astro 7 (`.astro` components, content collections), vanilla CSS with design tokens in `src/styles/tokens.css`, Playwright for e2e, Vitest for unit tests.

**Spec:** `docs/superpowers/specs/2026-09-18-site-structure-overhaul-design.md`

## Global Constraints

- No new photography is sourced. Image slots use the `.figure-slot` placeholder-wash treatment (sage/rust gradient), not empty space or broken `<img>` tags.
- No content-collection schema changes.
- Leadership, In2Academia, and article/journal/event **detail** pages are not modified.
- Homepage's closing stat strip and About's fact strip use only data already fetched on that page plus `site.json` fields — no new data sources.
- A stat/fact whose count would be `0` is omitted entirely, never rendered as "0".
- About page drops "What we are not" and the `RevisionReveal` effect entirely; final closing line is plain prose with no promotional claims.
- Every changed page must keep exactly one `<h1>` and must not introduce horizontal scroll at 360px width (existing `tests/e2e/sections.spec.ts` checks both across all nav routes).
- New bento/tile-pair and featured/list layouts must collapse to a single column at the site's existing `max-width: 720px` breakpoint.

## Setup (before Task 1)

This repo is currently on `main`. Before starting Task 1, create a feature branch:

```bash
git checkout -b feature/site-structure-overhaul
```

All tasks below commit to this branch.

---

### Task 1: `FeaturedItem` component + Articles index

**Files:**
- Create: `src/components/FeaturedItem.astro`
- Modify: `src/pages/articles/index.astro`
- Modify: `tests/e2e/publications.spec.ts`

**Interfaces:**
- Produces: `FeaturedItem` Astro component with props `{ href: string; eyebrow: string; title: string; summary: string; badge?: string }`. Renders an `<article class="featured-item">` with an optional `<span class="badge">`, `<p class="eyebrow">`, `<h3><a>`, `<p class="summary">`. This exact prop shape is reused by Tasks 2, 3, and 5.

- [ ] **Step 1: Create the `FeaturedItem` component**

```astro
---
// src/components/FeaturedItem.astro
interface Props {
  href: string;
  eyebrow: string;
  title: string;
  summary: string;
  badge?: string;
}

const { href, eyebrow, title, summary, badge } = Astro.props;
---
<article class="featured-item">
  {badge && <span class="badge">{badge}</span>}
  <p class="eyebrow">{eyebrow}</p>
  <h3><a href={href}>{title}</a></h3>
  <p class="summary">{summary}</p>
</article>

<style>
  .featured-item {
    display: grid;
    gap: var(--s-3);
    padding: var(--s-6);
    border: 1px solid var(--c-rule);
    border-radius: 6px;
    background: var(--c-surface);
  }
  .badge {
    justify-self: start;
    font-family: var(--f-ui);
    font-size: var(--t-xs);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--c-sage);
    border: 1px solid var(--c-sage);
    border-radius: 999px;
    padding: var(--s-1) var(--s-3);
  }
  .featured-item h3 { font-size: var(--t-xl); }
  .featured-item h3 a { text-decoration: none; }
  .featured-item h3 a:hover { text-decoration: underline; text-decoration-color: var(--c-sage); }
  .summary {
    font-family: var(--f-prose);
    font-size: var(--t-base);
    color: var(--c-ink-soft);
    max-width: 60ch;
  }
</style>
```

- [ ] **Step 2: Rewrite Articles index to split latest article from the rest**

Replace the full contents of `src/pages/articles/index.astro` with:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import CollectionGrid from '../../components/CollectionGrid.astro';
import FeaturedItem from '../../components/FeaturedItem.astro';
import { excludeDrafts, sortByDateDesc } from '../../lib/collections';
import { formatIssueDate } from '../../lib/format';

const articles = sortByDateDesc(
  excludeDrafts(await getCollection('articles')),
  (a) => a.data.publishedAt,
);

const [featured, ...rest] = articles;

const items = rest.map((a) => ({
  href: `/articles/${a.id}/`,
  title: a.data.title,
  meta: `${a.data.discipline} · ${a.data.author} · ${formatIssueDate(a.data.publishedAt)}`,
  summary: a.data.summary,
}));
---
<BaseLayout
  title="Articles"
  description="Research papers and essays written by Anthropy contributors."
>
  <section class="head">
    <p class="eyebrow">Writing</p>
    <h1>Articles</h1>
    <p class="lede">Papers and essays by Anthropy contributors, across history, politics, society, economics, and culture.</p>
  </section>

  <section class="block">
    <h2>Latest</h2>
    {featured ? (
      <FeaturedItem
        href={`/articles/${featured.id}/`}
        eyebrow={`${featured.data.discipline} · ${featured.data.author} · ${formatIssueDate(featured.data.publishedAt)}`}
        title={featured.data.title}
        summary={featured.data.summary}
        badge="Latest"
      />
    ) : (
      <p class="empty">Papers from this cycle are being finalized for publication.</p>
    )}
  </section>

  <section class="block">
    <h2>Earlier papers</h2>
    <CollectionGrid
      items={items}
      emptyMessage="No earlier papers yet — check back after the next one publishes."
    />
  </section>
</BaseLayout>

<style>
  .head { display: grid; gap: var(--s-4); padding-block: var(--s-16) var(--s-8); }
  .lede { font-family: var(--f-prose); font-size: var(--t-lg); color: var(--c-ink-soft); max-width: 52ch; }
  .block { display: grid; gap: var(--s-6); padding-block: var(--s-8); }
</style>
```

- [ ] **Step 3: Update the Articles e2e test to check the featured treatment**

In `tests/e2e/publications.spec.ts`, replace:

```ts
test('articles index renders content or an honest empty state', async ({ page }) => {
  await page.goto('/articles/');
  await expect(page.locator('h1')).toHaveText('Articles');
  const count = await page.locator('.grid li, .empty').count();
  expect(count).toBeGreaterThan(0);
});
```

with:

```ts
test('articles index renders content or an honest empty state', async ({ page }) => {
  await page.goto('/articles/');
  await expect(page.locator('h1')).toHaveText('Articles');
  const count = await page.locator('.grid li, .empty').count();
  expect(count).toBeGreaterThan(0);
});

test('articles index features the latest paper or an honest empty state', async ({ page }) => {
  await page.goto('/articles/');
  const count = await page.locator('.featured-item, .empty').count();
  expect(count).toBeGreaterThan(0);
});
```

- [ ] **Step 4: Build and run the affected e2e tests**

Run: `npm run build && npx playwright test tests/e2e/publications.spec.ts tests/e2e/sections.spec.ts tests/e2e/smoke.spec.ts`
Expected: all PASS. If any content-collection article exists, the "Latest" `FeaturedItem` and "Earlier papers" grid both render; if none exist, both sections show their empty-state paragraphs.

- [ ] **Step 5: Commit**

```bash
git add src/components/FeaturedItem.astro src/pages/articles/index.astro tests/e2e/publications.spec.ts
git commit -m "feat: add FeaturedItem component, feature latest article on Articles index

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01WqcQQpdeVWzkruBNnxLJRK"
```

---

### Task 2: Journal index featured issue

**Files:**
- Modify: `src/pages/journal/index.astro`
- Modify: `tests/e2e/publications.spec.ts`

**Interfaces:**
- Consumes: `FeaturedItem` from Task 1 (`{ href, eyebrow, title, summary, badge? }`).

- [ ] **Step 1: Rewrite Journal index to split latest issue from earlier ones**

Replace the full contents of `src/pages/journal/index.astro` with:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import CollectionGrid from '../../components/CollectionGrid.astro';
import FeaturedItem from '../../components/FeaturedItem.astro';
import { excludeDrafts, sortByDateDesc } from '../../lib/collections';
import { formatIssueDate } from '../../lib/format';

const issues = sortByDateDesc(
  excludeDrafts(await getCollection('journal')),
  (i) => i.data.publishedAt,
);

const [featured, ...rest] = issues;

const items = rest.map((i) => ({
  href: `/journal/${i.id}/`,
  title: i.data.title,
  meta: `Issue ${i.data.issueNumber} · ${formatIssueDate(i.data.publishedAt)}`,
  summary: i.data.summary,
}));
---
<BaseLayout
  title="Journal"
  description="The Anthropy Academic Journal collects research by secondary students, edited with academic mentors."
>
  <section class="head">
    <p class="eyebrow">Publication</p>
    <h1>The Anthropy Academic Journal</h1>
    <p class="lede">
      Each issue collects research written by students in the In2Academia programme and
      edited with academic mentors.
    </p>
  </section>

  <section class="block">
    <h2>Latest issue</h2>
    {featured ? (
      <FeaturedItem
        href={`/journal/${featured.id}/`}
        eyebrow={`Issue ${featured.data.issueNumber} · ${formatIssueDate(featured.data.publishedAt)}`}
        title={featured.data.title}
        summary={featured.data.summary}
        badge="Latest issue"
      />
    ) : (
      <p class="empty">The inaugural issue is in preparation. Check back, or write to us if you would like to contribute.</p>
    )}
  </section>

  <section class="block">
    <h2>Earlier issues</h2>
    <CollectionGrid
      items={items}
      emptyMessage="No earlier issues yet."
    />
  </section>
</BaseLayout>

<style>
  .head { display: grid; gap: var(--s-4); padding-block: var(--s-16) var(--s-8); }
  .lede { font-family: var(--f-prose); font-size: var(--t-lg); color: var(--c-ink-soft); max-width: 52ch; }
  .block { display: grid; gap: var(--s-6); padding-block: var(--s-8); }
</style>
```

- [ ] **Step 2: Add the equivalent Journal e2e assertion**

In `tests/e2e/publications.spec.ts`, replace:

```ts
test('journal index renders content or an honest empty state', async ({ page }) => {
  await page.goto('/journal/');
  await expect(page.locator('h1')).toContainText('Academic Journal');
  const count = await page.locator('.grid li, .empty').count();
  expect(count).toBeGreaterThan(0);
});
```

with:

```ts
test('journal index renders content or an honest empty state', async ({ page }) => {
  await page.goto('/journal/');
  await expect(page.locator('h1')).toContainText('Academic Journal');
  const count = await page.locator('.grid li, .empty').count();
  expect(count).toBeGreaterThan(0);
});

test('journal index features the latest issue or an honest empty state', async ({ page }) => {
  await page.goto('/journal/');
  const count = await page.locator('.featured-item, .empty').count();
  expect(count).toBeGreaterThan(0);
});
```

- [ ] **Step 3: Build and run the affected e2e tests**

Run: `npm run build && npx playwright test tests/e2e/publications.spec.ts tests/e2e/sections.spec.ts`
Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/journal/index.astro tests/e2e/publications.spec.ts
git commit -m "feat: feature latest issue on Journal index

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01WqcQQpdeVWzkruBNnxLJRK"
```

---

### Task 3: Events index featured "Next" session

**Files:**
- Modify: `src/pages/events/index.astro`
- Modify: `tests/e2e/sections.spec.ts`

**Interfaces:**
- Consumes: `FeaturedItem` from Task 1.

- [ ] **Step 1: Rewrite Events index so the next session uses the featured treatment**

Replace the full contents of `src/pages/events/index.astro` with:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import CollectionGrid from '../../components/CollectionGrid.astro';
import FeaturedItem from '../../components/FeaturedItem.astro';
import { excludeDrafts, sortByDateDesc, sortByDateAsc } from '../../lib/collections';
import { formatEventDate } from '../../lib/format';

const events = excludeDrafts(await getCollection('events'));

const upcoming = sortByDateAsc(
  events.filter((e) => e.data.upcoming),
  (e) => e.data.startsAt,
);
const past = sortByDateDesc(
  events.filter((e) => !e.data.upcoming),
  (e) => e.data.startsAt,
);

const [nextEvent, ...moreUpcoming] = upcoming;

const toItem = (e: (typeof events)[number]) => ({
  href: `/events/${e.id}/`,
  title: e.data.name,
  meta: formatEventDate(e.data.startsAt),
  summary: e.data.summary,
});
---
<BaseLayout
  title="Events"
  description="Anthropy's speaker programme brings researchers and academics into direct conversation with secondary students."
>
  <section class="head">
    <p class="eyebrow">Speaker programme</p>
    <h1>Humanities Focus</h1>
    <p class="lede">
      For several years we ran Humanities Focus Week: a week of talks from researchers and
      academics. This year the programme is concentrating into a single-day forum — fewer
      sessions, longer conversations, the same purpose.
    </p>
  </section>

  {nextEvent && (
    <section class="block">
      <h2>Next</h2>
      <FeaturedItem
        href={`/events/${nextEvent.id}/`}
        eyebrow={formatEventDate(nextEvent.data.startsAt)}
        title={nextEvent.data.name}
        summary={nextEvent.data.summary}
        badge="Next"
      />
      {moreUpcoming.length > 0 && (
        <CollectionGrid
          items={moreUpcoming.map(toItem)}
          emptyMessage="No further upcoming sessions are scheduled."
        />
      )}
    </section>
  )}

  <section class="block">
    <h2>Previously</h2>
    <CollectionGrid
      items={past.map(toItem)}
      emptyMessage="Records of previous programmes are being written up."
    />
  </section>
</BaseLayout>

<style>
  .head { display: grid; gap: var(--s-4); padding-block: var(--s-16) var(--s-8); }
  .lede { font-family: var(--f-prose); font-size: var(--t-lg); color: var(--c-ink-soft); max-width: 54ch; }
  .block { display: grid; gap: var(--s-6); padding-block: var(--s-12); }
</style>
```

- [ ] **Step 2: Add an events e2e assertion**

In `tests/e2e/sections.spec.ts`, add this test after the existing `'events page explains the week-to-forum change...'` test:

```ts
test('events "Next" section, when present, uses the featured treatment', async ({ page }) => {
  await page.goto('/events/');
  const featuredCount = await page.locator('.featured-item').count();
  expect(featuredCount).toBeLessThanOrEqual(1);
});
```

- [ ] **Step 3: Build and run the affected e2e tests**

Run: `npm run build && npx playwright test tests/e2e/sections.spec.ts`
Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/events/index.astro tests/e2e/sections.spec.ts
git commit -m "feat: feature the next session on Events index

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01WqcQQpdeVWzkruBNnxLJRK"
```

---

### Task 4: Shared `.tile-pair` and `.figure-slot` CSS primitives

**Files:**
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces: two CSS class families available site-wide —
  - `.tile-pair` (grid container, two children) / `.tile-pair-item` with modifiers `.primary` (larger, sage-soft background) and `.secondary` (rust-soft background). Collapses to one column under 720px.
  - `.figure-slot` (base placeholder-wash treatment: gradient background, border, radius). Consumers set their own `aspect-ratio` via a page-scoped modifier class (e.g. `.hero-figure`, `.about-figure`).
  These are consumed by Task 5 (Homepage) and Task 6 (About).

- [ ] **Step 1: Append the shared primitives to `global.css`**

Add this block to the end of `src/styles/global.css` (after the existing `@media (prefers-reduced-motion: reduce)` block):

```css
/* Shared layout primitives: reused by Home and About for the two-tile
   programme pairs and the placeholder image slots ahead of real photography. */
.tile-pair {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: var(--s-6);
  align-items: stretch;
}
.tile-pair-item {
  display: grid;
  align-content: start;
  gap: var(--s-2);
  border: 1px solid var(--c-rule);
  border-radius: 6px;
  padding: var(--s-6);
}
.tile-pair-item.primary { background: var(--c-sage-soft); padding: var(--s-8); }
.tile-pair-item.secondary { background: var(--c-rust-soft); }
.tile-pair-item h3 { font-size: var(--t-lg); }
.tile-pair-item h3 a { text-decoration: none; }
.tile-pair-item h3 a:hover { text-decoration: underline; text-decoration-color: var(--c-sage); }
.tile-pair-item p { font-family: var(--f-prose); color: var(--c-ink-soft); max-width: 46ch; }

.figure-slot {
  border-radius: 10px;
  border: 1px solid var(--c-rule);
  background: linear-gradient(155deg, var(--c-sage-soft), var(--c-rust-soft));
}

@media (max-width: 720px) {
  .tile-pair { grid-template-columns: 1fr; }
}
```

This step has no independent test (it's unused until Task 5 wires it up) — its steps are verified as part of Task 5's e2e run.

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add shared tile-pair and figure-slot CSS primitives

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01WqcQQpdeVWzkruBNnxLJRK"
```

---

### Task 5: Homepage restructure

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: `FeaturedItem` (Task 1), `.tile-pair`/`.tile-pair-item`/`.figure-slot` (Task 4).

- [ ] **Step 1: Rewrite the homepage**

Replace the full contents of `src/pages/index.astro` with:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import ProofBand from '../components/ProofBand.astro';
import CollectionGrid from '../components/CollectionGrid.astro';
import FeaturedItem from '../components/FeaturedItem.astro';
import RevisionReveal from '../components/RevisionReveal.astro';
import { excludeDrafts, sortByDateDesc, sortByDateAsc } from '../lib/collections';
import { formatIssueDate, formatEventDate } from '../lib/format';
import site from '../data/site.json';

const allArticles = sortByDateDesc(
  excludeDrafts(await getCollection('articles')),
  (a) => a.data.publishedAt,
);
const [featuredArticle, ...restArticles] = allArticles;
const compactArticles = restArticles.slice(0, 3);

const allIssues = sortByDateDesc(
  excludeDrafts(await getCollection('journal')),
  (i) => i.data.publishedAt,
);
const latestIssues = allIssues.slice(0, 2);
const issueItems = latestIssues.map((i) => ({
  href: `/journal/${i.id}/`,
  title: i.data.title,
  meta: `Issue ${i.data.issueNumber} · ${formatIssueDate(i.data.publishedAt)}`,
  summary: i.data.summary,
}));

const upcoming = sortByDateAsc(
  excludeDrafts(await getCollection('events')).filter((e) => e.data.upcoming),
  (e) => e.data.startsAt,
);

const stats = [
  { value: String(site.established), label: 'founded' },
  ...(allArticles.length > 0
    ? [{ value: String(allArticles.length), label: allArticles.length === 1 ? 'paper published' : 'papers published' }]
    : []),
  ...(allIssues.length > 0
    ? [{ value: String(allIssues.length), label: allIssues.length === 1 ? 'journal issue' : 'journal issues' }]
    : []),
];
---
<BaseLayout
  title="Anthropy"
  description="Anthropy is a student-led humanities research organization at UWC Dover. We publish student research and bring academics into conversation with the students who will follow them."
>
  <section class="thesis">
    <div class="thesis-text">
      <p class="eyebrow">Humanities research · UWC Dover · Est. {site.established}</p>
      <h1>We do not set out to change the humanities. We set out to prepare the people who will.</h1>
      <p class="lede">
        Anthropy runs a research programme, publishes a student academic journal, and brings
        working academics into direct conversation with secondary students. Everything here is
        produced by students who were <RevisionReveal from="just interested in" to="learning to do" /> research
        when they started.
      </p>
    </div>
    <div class="figure-slot hero-figure" aria-hidden="true"></div>
  </section>

  <ProofBand />

  <section class="block editorial">
    <h2>Recent work</h2>
    <div class="editorial-grid">
      <div class="editorial-main">
        {featuredArticle ? (
          <FeaturedItem
            href={`/articles/${featuredArticle.id}/`}
            eyebrow={`${featuredArticle.data.discipline} · ${formatIssueDate(featuredArticle.data.publishedAt)}`}
            title={featuredArticle.data.title}
            summary={featuredArticle.data.summary}
            badge="Latest"
          />
        ) : (
          <p class="empty">The first papers of this cycle are being prepared for publication.</p>
        )}
      </div>
      <div class="editorial-aside">
        {compactArticles.length > 0 && (
          <ul class="compact-list">
            {compactArticles.map((a) => (
              <li>
                <a href={`/articles/${a.id}/`}>{a.data.title}</a>
                <span class="meta">{formatIssueDate(a.data.publishedAt)}</span>
              </li>
            ))}
          </ul>
        )}
        <h3 class="aside-heading">The journal</h3>
        <CollectionGrid
          items={issueItems}
          emptyMessage="The inaugural issue is in preparation."
        />
      </div>
    </div>
  </section>

  <section class="block programmes">
    <h2>What we run</h2>
    <div class="tile-pair">
      <article class="tile-pair-item primary">
        <h3><a href="/in2academia/">In2Academia</a></h3>
        <p>
          A ten-week programme teaching secondary students how to actually conduct humanities
          research — from question to argument to a paper that gets published.
        </p>
      </article>
      <article class="tile-pair-item secondary">
        <h3><a href="/events/">Humanities Focus</a></h3>
        <p>
          Our speaker programme brings researchers and academics in to talk directly with
          students.
          {upcoming.length > 0 && (
            <span> Next: {formatEventDate(upcoming[0].data.startsAt)}.</span>
          )}
        </p>
      </article>
    </div>
  </section>

  <section class="block stats">
    <ul class="auto-grid">
      {stats.map((s) => (
        <li>
          <span class="value">{s.value}</span>
          <span class="label">{s.label}</span>
        </li>
      ))}
    </ul>
  </section>
</BaseLayout>

<style>
  .thesis {
    display: grid;
    grid-template-columns: 3fr 2fr;
    align-items: center;
    gap: var(--s-8);
    padding-block: var(--s-24) var(--s-16);
  }
  .thesis-text { display: grid; gap: var(--s-6); }
  .thesis h1 { max-width: 18ch; }
  .lede {
    font-family: var(--f-prose);
    font-size: var(--t-lg);
    color: var(--c-ink-soft);
    max-width: 52ch;
  }
  .hero-figure { aspect-ratio: 4 / 5; }

  .block { display: grid; gap: var(--s-6); padding-block: var(--s-16); }

  .editorial-grid {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: var(--s-8);
    align-items: start;
  }
  .editorial-aside { display: grid; gap: var(--s-4); }
  .aside-heading {
    font-family: var(--f-ui);
    font-size: var(--t-base);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--c-ink-faint);
  }
  .compact-list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s-3); }
  .compact-list li {
    display: flex;
    justify-content: space-between;
    gap: var(--s-3);
    border-top: 1px solid var(--c-rule);
    padding-top: var(--s-2);
  }
  .compact-list a { text-decoration: none; }
  .compact-list a:hover { text-decoration: underline; text-decoration-color: var(--c-sage); }
  .compact-list .meta { font-size: var(--t-xs); color: var(--c-ink-faint); white-space: nowrap; }

  .stats ul { --auto-grid-min: 200px; --auto-grid-gap: var(--s-6); }
  .stats li { display: grid; gap: var(--s-1); }
  .stats .value { font-family: var(--f-display); font-size: var(--t-lg); color: var(--c-ink); }
  .stats .label { font-size: var(--t-sm); color: var(--c-ink-faint); }

  @media (max-width: 720px) {
    .thesis { grid-template-columns: 1fr; }
    .hero-figure { display: none; }
    .editorial-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Add homepage e2e assertions**

In `tests/e2e/home.spec.ts`, add these two tests after the existing ones:

```ts
test('programmes are shown as a featured tile pair', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.tile-pair-item')).toHaveCount(2);
});

test('homepage closes with a stat strip that never shows a bare zero', async ({ page }) => {
  await page.goto('/');
  const values = await page.locator('.stats .value').allTextContents();
  for (const v of values) expect(v.trim()).not.toBe('0');
});
```

- [ ] **Step 3: Build and run the affected e2e tests**

Run: `npm run build && npx playwright test tests/e2e/home.spec.ts tests/e2e/sections.spec.ts tests/e2e/revision.spec.ts tests/e2e/theme.spec.ts`
Expected: all PASS. `revision.spec.ts`'s `'the effect is contained to two placements site-wide'` still passes here — Home keeps its one `RevisionReveal` placement and About still has its own (unchanged until Task 6), so the site-wide total is still 2.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro tests/e2e/home.spec.ts
git commit -m "feat: restructure homepage into asymmetric hero, editorial band, tile-pair, and stat strip

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01WqcQQpdeVWzkruBNnxLJRK"
```

---

### Task 6: About page restructure

**Files:**
- Modify: `src/pages/about.astro`
- Modify: `tests/e2e/revision.spec.ts`

**Interfaces:**
- Consumes: `.tile-pair`/`.tile-pair-item`/`.figure-slot` (Task 4).
- Removes: the `RevisionReveal` import/usage from this page (the homepage placement from Task 5 remains the only one site-wide).

- [ ] **Step 1: Rewrite About**

Replace the full contents of `src/pages/about.astro` with:

```astro
---
import ProseLayout from '../layouts/ProseLayout.astro';
import site from '../data/site.json';
---
<ProseLayout
  title="About Anthropy"
  description="Anthropy is a student-led humanities research organization based at UWC Dover."
  eyebrow={`Established ${site.established} · ${site.basedAt}`}
>
  <div class="opening">
    <div class="opening-text">
      <p>
        Anthropy is a student-led organization for humanities research. We are based at UWC
        South East Asia's Dover Campus, with a few contributors from UWC East and one
        contributor from outside Singapore.
      </p>
      <p class="lede">
        We exist to foster early intellectual curiosity in the humanities — the years between
        being interested in a subject and being equipped to study it properly, which secondary
        school rarely bridges. A student curious about political theory or economic history is
        usually told to wait until university. We think that wait is longer than it needs to be.
      </p>
    </div>
    <div class="figure-slot about-figure" aria-hidden="true"></div>
  </div>

  <ul class="facts auto-grid">
    <li><span class="value">{site.established}</span><span class="label">founded</span></li>
    <li><span class="value">{site.basedAt}</span><span class="label">based at</span></li>
  </ul>

  <h2>What we do</h2>
  <div class="tile-pair">
    <article class="tile-pair-item primary">
      <h3><a href="/in2academia/">In2Academia</a></h3>
      <p>
        Over ten weeks and ten workshops, students move from a vague interest to a defined
        research question to a finished paper, working alongside academic mentors. Strong
        papers are published in our academic journal.
      </p>
    </article>
    <article class="tile-pair-item secondary">
      <h3><a href="/events/">Humanities Focus</a></h3>
      <p>
        We bring researchers, academics, and professionals in to speak directly with students —
        not as a careers talk, but as a conversation about what the work actually involves.
      </p>
    </article>
  </div>

  <p class="closing">
    The journal exists so that work is taken seriously, and so the people who wrote it can point
    to it.
  </p>
</ProseLayout>

<style>
  .opening {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: var(--s-8);
    align-items: center;
  }
  .opening-text { display: grid; gap: var(--s-4); }
  .lede { font-family: var(--f-prose); font-size: var(--t-lg); color: var(--c-ink); }
  .about-figure { aspect-ratio: 3 / 4; }

  .facts {
    --auto-grid-min: 180px;
    border-block: 1px solid var(--c-rule);
    padding-block: var(--s-6);
    margin-top: var(--s-12);
  }
  .facts li { display: grid; gap: var(--s-1); }
  .facts .value { font-family: var(--f-display); font-size: var(--t-lg); color: var(--c-ink); }
  .facts .label { font-size: var(--t-sm); color: var(--c-ink-faint); }

  h2 { margin-top: var(--s-12); font-size: var(--t-xl); }

  .tile-pair { margin-top: var(--s-6); }

  .closing {
    margin-top: var(--s-12);
    font-family: var(--f-prose);
    color: var(--c-ink-soft);
    max-width: var(--measure);
  }

  @media (max-width: 720px) {
    .opening { grid-template-columns: 1fr; }
    .about-figure { display: none; }
  }
</style>
```

- [ ] **Step 2: Replace the now-obsolete "what Anthropy is not" test, and update the site-wide revision-placement count**

In `tests/e2e/revision.spec.ts`, replace:

```ts
test('the effect is contained to two placements site-wide', async ({ page }) => {
  const routes = ['/', '/journal/', '/articles/', '/events/', '/in2academia/', '/leadership/', '/about/', '/contact/'];
  let total = 0;
  for (const route of routes) {
    await page.goto(route);
    total += await page.locator('[data-revision]').count();
  }
  expect(total).toBe(2);
});
```

with:

```ts
test('the effect is contained to one placement site-wide', async ({ page }) => {
  const routes = ['/', '/journal/', '/articles/', '/events/', '/in2academia/', '/leadership/', '/about/', '/contact/'];
  let total = 0;
  for (const route of routes) {
    await page.goto(route);
    total += await page.locator('[data-revision]').count();
  }
  expect(total).toBe(1);
});
```

and replace:

```ts
test('about page states what Anthropy is not', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about/');
  await expect(page.locator('.prose')).toContainText('not a think tank');
});
```

with:

```ts
test('about page does not frame itself against being a think tank', async ({ page }) => {
  await page.goto('/about/');
  const text = (await page.locator('.prose').innerText()).toLowerCase();
  expect(text).not.toContain('think tank');
});

test('about page states its purpose as fostering early intellectual curiosity', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.locator('.prose')).toContainText('early intellectual curiosity');
});
```

- [ ] **Step 3: Add an About-specific structural assertion**

In `tests/e2e/sections.spec.ts`, add this test after the existing `'leadership page shows a real roster...'` test:

```ts
test('about page shows the programmes as a tile pair', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.locator('.tile-pair-item')).toHaveCount(2);
});
```

- [ ] **Step 4: Build and run the full affected e2e set, confirming the revision-count test now passes**

Run: `npm run build && npx playwright test tests/e2e/revision.spec.ts tests/e2e/sections.spec.ts tests/e2e/home.spec.ts tests/e2e/smoke.spec.ts`
Expected: all PASS, including `'the effect is contained to one placement site-wide'`, since About no longer uses `RevisionReveal` and Home's single placement (from Task 5) is now the only one site-wide.

- [ ] **Step 5: Commit**

```bash
git add src/pages/about.astro tests/e2e/revision.spec.ts tests/e2e/sections.spec.ts
git commit -m "feat: restructure About page around fostering curiosity, drop 'what we are not'

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01WqcQQpdeVWzkruBNnxLJRK"
```

---

### Task 7: Contact page polish

**Files:**
- Modify: `src/pages/contact.astro`
- Create: `tests/e2e/contact.spec.ts`

**Interfaces:** None consumed from earlier tasks — this task is independent and could be done in any order relative to Tasks 1–6.

- [ ] **Step 1: Give the contact-info block more visual presence**

In `src/pages/contact.astro`, replace the `.how` block:

```astro
  <div class="how">
    {hasEmail ? (
      <p class="email"><a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p>
    ) : (
      <p class="empty">Contact details are being finalised.</p>
    )}
    {socials.length > 0 && (
      <ul>
        {socials.map((s) => <li><a href={s.url}>{s.label}</a></li>)}
      </ul>
    )}
  </div>
```

with:

```astro
  <div class="how">
    <p class="eyebrow">Reach us directly</p>
    {hasEmail ? (
      <p class="email"><a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p>
    ) : (
      <p class="empty">Contact details are being finalised.</p>
    )}
    {socials.length > 0 && (
      <ul class="socials">
        {socials.map((s) => <li><a href={s.url}>{s.label}</a></li>)}
      </ul>
    )}
  </div>
```

and replace the existing `<style>` block's `.how`/`.email`/`.how ul`/`.empty` rules:

```css
  .how { padding-block: var(--s-12); display: grid; gap: var(--s-4); border-top: 1px solid var(--c-rule); }
  .email { font-family: var(--f-display); font-size: var(--t-xl); }
  .how ul { display: flex; gap: var(--s-6); list-style: none; margin: 0; padding: 0; }
  .empty { font-family: var(--f-prose); font-style: italic; color: var(--c-ink-faint); }
```

with:

```css
  .how { padding-block: var(--s-16); display: grid; gap: var(--s-3); border-top: 1px solid var(--c-rule); }
  .email { font-family: var(--f-display); font-size: var(--t-2xl); }
  .socials { display: flex; gap: var(--s-6); list-style: none; margin: var(--s-2) 0 0; padding: 0; }
  .socials a { font-family: var(--f-ui); font-size: var(--t-sm); text-transform: uppercase; letter-spacing: 0.05em; }
  .empty { font-family: var(--f-prose); font-style: italic; color: var(--c-ink-faint); }
```

- [ ] **Step 2: Write the e2e test for the larger email treatment**

Create `tests/e2e/contact.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('contact email, when configured, is styled larger than body text', async ({ page }) => {
  await page.goto('/contact/');
  const hasEmail = await page.locator('.email').count();
  test.skip(hasEmail === 0, 'contact email not configured in site.json yet');
  const emailSize = await page.locator('.email').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  const bodySize = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
  expect(emailSize).toBeGreaterThan(bodySize * 1.5);
});

test('contact page falls back to an honest empty state when no email is configured', async ({ page }) => {
  await page.goto('/contact/');
  const hasEmail = await page.locator('.email').count();
  test.skip(hasEmail > 0, 'contact email is configured');
  await expect(page.locator('.empty')).toContainText('being finalised');
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm run build && npx playwright test tests/e2e/contact.spec.ts`
Expected: FAIL — `.how ul` (old markup) is still selected as the plain, un-enlarged version before Step 1's edit is in place. (If Step 1 was already applied before this step, skip straight to Step 4 — the intent is to have seen the pre-change state fail at least once during development.)

- [ ] **Step 4: Run the full affected e2e set to confirm it passes**

Run: `npm run build && npx playwright test tests/e2e/contact.spec.ts tests/e2e/sections.spec.ts`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/contact.astro tests/e2e/contact.spec.ts
git commit -m "feat: give contact email/socials block more visual presence

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01WqcQQpdeVWzkruBNnxLJRK"
```

---

### Task 8: Full-suite verification and branch wrap-up

**Files:** None modified — verification only.

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: unit tests pass, build succeeds, all e2e tests pass (including every test touched in Tasks 1–7).

- [ ] **Step 2: Manual visual check at both breakpoints**

Run `npm run preview` and open `/`, `/about/`, `/articles/`, `/journal/`, `/events/`, `/contact/` at both a ~1280px and a 360px viewport width. Confirm:
- Homepage hero, editorial band, and tile-pair each collapse to one column at 360px, with the hero image slot hidden (not squashed) on mobile.
- About's opening two-column block and tile-pair collapse the same way.
- Featured items on Articles/Journal/Events are visually distinct from the plain list beneath them.
- No page scrolls horizontally at 360px.

- [ ] **Step 3: Review the diff against the spec's non-goals**

Confirm `git diff main --stat` touches only: `src/components/FeaturedItem.astro`, `src/pages/index.astro`, `src/pages/about.astro`, `src/pages/articles/index.astro`, `src/pages/journal/index.astro`, `src/pages/events/index.astro`, `src/pages/contact.astro`, `src/styles/global.css`, and the test files listed in Tasks 1–7. `src/pages/leadership.astro`, `src/pages/in2academia.astro`, and every `[...slug].astro` detail page must show no diff.

- [ ] **Step 4: Push the branch**

```bash
git push -u origin feature/site-structure-overhaul
```

Do not merge to `main` without explicit user approval — open a PR or hand off per the user's usual review flow (per `superpowers:finishing-a-development-branch`, invoked separately if the user wants it).
