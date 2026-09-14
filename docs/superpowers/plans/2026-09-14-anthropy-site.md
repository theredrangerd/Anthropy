# Anthropy Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, credibility-first website for Anthropy — a UWC Dover student humanities research organization — that makes its research pipeline legible to outside speakers and admissions readers, and that a non-technical successor can keep updated by editing files.

**Architecture:** Astro static site. All content lives as Markdown/JSON in `src/content/` and `src/data/`, typed by Zod schemas, so adding a journal issue or a leadership year is a file change with no component edits. Pure logic lives in `src/lib/` under Vitest unit tests; page rendering is verified by Playwright e2e tests against a built preview server. Styling is hand-written CSS driven by a design-token layer — no CSS framework — so the site stays portable and permanent. Output is a plain `dist/` folder copied to a Synology NAS.

**Tech Stack:** Astro 7.3.2 (static output, TypeScript), `@astrojs/mdx` 8.0.1, `@astrojs/sitemap` 3.7.4, `sharp` 0.35.4, Vitest 5.0.0, Playwright 1.63.0. Google Fonts: Fraunces (display), Newsreader (prose), Archivo (UI). No CSS framework, no CMS, no runtime server.

**Spec:** `docs/superpowers/specs/2026-09-14-anthropy-site-design.md`

## Global Constraints

- **Node:** v24.16.0 available; require Node >= 22.12.0 (the floor declared by `astro@7.3.2` and `@astrojs/mdx@8.0.1` themselves — a lower floor in our own manifest would mislead contributors into an install that then fails).
- **Output must be fully static.** No SSR adapter, no server runtime, no database, no login. `output: 'static'`.
- **Site URL:** `https://anthropy.wetkarma.com` — set as `site` in `astro.config.mjs`. All internal links must be root-relative (`/journal/`), never absolute to a domain, so relocation is a DNS change plus a file copy.
- **Never fabricate real people or outcomes.** Alumni names/universities, leadership bios, speaker names, and paper authors are real-world claims. Seed files use content explicitly labelled as an example template. Do not invent a plausible-looking name, university, or quotation anywhere in this build. Where real data is absent, components must render a clean empty state, never placeholder people.
- **The new one-day HFW event has no confirmed name.** Never hard-code a name for it in a template or nav label. It is a content field in `src/content/events/`. "Humanities Focus Week" remains correct for past years.
- **Scope framing in all copy:** Anthropy is based at UWC Dover with contributors from elsewhere. Never describe it as a multi-campus or federated institution.
- **Content collections must look intentional at 1 item and at 30.** No layout may depend on a minimum item count.
- **Accessibility:** every interactive element has a visible focus state; all motion respects `prefers-reduced-motion`; images have real `alt` text.
- **Theming:** tokens defined on bare `:root` (light), redefined under `@media (prefers-color-scheme: dark)` guarded as `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`. Never declare a color only inside a media or `[data-theme]` block.
- **Commit after every task.** Conventional commit messages (`feat:`, `test:`, `chore:`, `docs:`).

---

## File Structure

| Path | Responsibility |
|---|---|
| `astro.config.mjs` | Astro config: static output, site URL, integrations |
| `src/content.config.ts` | Zod schemas for all four content collections |
| `src/content/journal/` | Journal issues (Markdown) |
| `src/content/articles/` | Student papers/articles (Markdown) |
| `src/content/events/` | HFW years + the new forum (Markdown) |
| `src/content/leadership/` | One file per leadership year (Markdown w/ frontmatter roster) |
| `src/data/site.json` | Org name, tagline, contact, social links |
| `src/data/alumni.json` | Alumni outcomes for the proof band (starts empty) |
| `src/lib/collections.ts` | Sorting/filtering/grouping helpers — unit tested |
| `src/lib/format.ts` | Date and name formatting — unit tested |
| `src/styles/tokens.css` | Design tokens: color, type scale, spacing |
| `src/styles/global.css` | Element defaults, prose styles, focus states |
| `src/layouts/BaseLayout.astro` | HTML shell, head, fonts, header/footer |
| `src/layouts/ProseLayout.astro` | Long-form reading layout for articles/issues |
| `src/components/SiteHeader.astro` | Primary nav |
| `src/components/SiteFooter.astro` | Socials, contact, colophon |
| `src/components/Seo.astro` | Meta/OG tags |
| `src/components/ProofBand.astro` | Alumni outcomes — the legitimacy signal |
| `src/components/CollectionGrid.astro` | Curated list that works at n=1 and n=30 |
| `src/components/RevisionReveal.astro` | The contained "drafting" effect |
| `src/pages/**` | One file per route |
| `tests/unit/` | Vitest specs for `src/lib/` |
| `tests/e2e/` | Playwright page specs |
| `docs/CONTENT-GUIDE.md` | Successor handoff doc — a required deliverable |

---

## Task 1: Project scaffold, git, and test harness

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `vitest.config.ts`, `playwright.config.ts`
- Create: `src/pages/index.astro`, `src/lib/format.ts`
- Test: `tests/unit/format.test.ts`, `tests/e2e/smoke.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: a working `npm run build`, `npm run test:unit`, `npm run test:e2e`. Exports `formatIssueDate(date: Date): string` from `src/lib/format.ts`.

- [ ] **Step 1: Initialize git and commit the spec**

```bash
cd /Users/theredranger/Desktop/Coding/anthropy
git init
mkdir -p docs/superpowers/plans
printf 'node_modules/\ndist/\n.astro/\ntest-results/\nplaywright-report/\n.DS_Store\n' > .gitignore
git add .gitignore docs/
git commit -m "chore: initialize repo with design spec and plan"
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "anthropy-site",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "engines": { "node": ">=20" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview --port 4321",
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "test": "npm run test:unit && npm run build && npm run test:e2e"
  },
  "dependencies": {
    "astro": "7.3.2",
    "@astrojs/mdx": "8.0.1",
    "@astrojs/sitemap": "3.7.4",
    "sharp": "0.35.4"
  },
  "devDependencies": {
    "vitest": "5.0.0",
    "@playwright/test": "1.63.0"
  }
}
```

- [ ] **Step 3: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://anthropy.wetkarma.com',
  output: 'static',
  integrations: [mdx(), sitemap()],
  build: { format: 'directory' },
});
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*", "tests/**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 6: Create `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4321' },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
```

- [ ] **Step 7: Install dependencies**

```bash
npm install
npx playwright install chromium
```

- [ ] **Step 8: Write the failing unit test**

Create `tests/unit/format.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { formatIssueDate } from '../../src/lib/format';

describe('formatIssueDate', () => {
  it('formats a date as "Month YYYY"', () => {
    expect(formatIssueDate(new Date('2026-03-15T00:00:00Z'))).toBe('March 2026');
  });

  it('is stable across timezones for first-of-month dates', () => {
    expect(formatIssueDate(new Date('2026-01-01T00:00:00Z'))).toBe('January 2026');
  });
});
```

- [ ] **Step 9: Run the unit test to verify it fails**

Run: `npm run test:unit`
Expected: FAIL — cannot resolve `../../src/lib/format`.

- [ ] **Step 10: Write the minimal implementation**

Create `src/lib/format.ts`:

```ts
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Formats a date as "Month YYYY" in UTC, so output never shifts by timezone. */
export function formatIssueDate(date: Date): string {
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
```

- [ ] **Step 11: Run the unit test to verify it passes**

Run: `npm run test:unit`
Expected: PASS, 2 tests.

- [ ] **Step 12: Create a placeholder homepage**

Create `src/pages/index.astro`:

```astro
---
const title = 'Anthropy';
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
  </head>
  <body>
    <h1>Anthropy</h1>
  </body>
</html>
```

- [ ] **Step 13: Write the failing e2e test**

Create `tests/e2e/smoke.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('homepage builds and serves', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Anthropy');
});
```

- [ ] **Step 14: Build and run the e2e test**

Run: `npm run build && npm run test:e2e`
Expected: PASS, 1 test.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project with vitest and playwright harness"
```

---

## Task 2: Design tokens, global styles, and BaseLayout

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/e2e/theme.spec.ts`

**Interfaces:**
- Consumes: Task 1's build harness.
- Produces: `BaseLayout.astro` accepting props `{ title: string; description: string; wide?: boolean }` and a default `<slot />`. All later pages use it.

**Design direction (derived from spec §7):** Navy as ink on warm parchment, sage as the working accent, a rust highlight used sparingly. Fraunces for display (characterful variable serif with optical sizing), Newsreader for prose (designed for long-form reading), Archivo for UI chrome. This is deliberately *not* the cream + Playfair + terracotta default; the pairing is chosen for a humanities research register.

- [ ] **Step 1: Create `src/styles/tokens.css`**

```css
:root {
  /* Ground & ink — light */
  --c-ground: #FBF9F4;
  --c-surface: #FFFFFF;
  --c-sunk: #F2EEE5;
  --c-ink: #14243A;
  --c-ink-soft: #46566C;
  --c-ink-faint: #77869A;
  --c-rule: #E0DACD;

  /* Accents */
  --c-sage: #4E6B57;
  --c-sage-soft: #E6EDE6;
  --c-rust: #A8492A;
  --c-rust-soft: #F6E7E0;

  /* Type */
  --f-display: 'Fraunces', Georgia, serif;
  --f-prose: 'Newsreader', Georgia, serif;
  --f-ui: 'Archivo', -apple-system, 'Segoe UI', sans-serif;

  --t-xs: 0.78rem;
  --t-sm: 0.9rem;
  --t-base: 1.0625rem;
  --t-lg: 1.3rem;
  --t-xl: 1.75rem;
  --t-2xl: 2.4rem;
  --t-3xl: 3.4rem;

  /* Space */
  --s-1: 0.25rem;
  --s-2: 0.5rem;
  --s-3: 0.75rem;
  --s-4: 1rem;
  --s-6: 1.5rem;
  --s-8: 2rem;
  --s-12: 3rem;
  --s-16: 4rem;
  --s-24: 6rem;

  --measure: 66ch;
  --page-max: 1120px;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    --c-ground: #101A26;
    --c-surface: #16222F;
    --c-sunk: #0B131C;
    --c-ink: #EDE8DD;
    --c-ink-soft: #B8C2CD;
    --c-ink-faint: #808E9D;
    --c-rule: #27343F;
    --c-sage: #8FB097;
    --c-sage-soft: #1B2A22;
    --c-rust: #D98straight;
    --c-rust-soft: #2E1B14;
  }
}

:root[data-theme='dark'] {
  --c-ground: #101A26;
  --c-surface: #16222F;
  --c-sunk: #0B131C;
  --c-ink: #EDE8DD;
  --c-ink-soft: #B8C2CD;
  --c-ink-faint: #808E9D;
  --c-rule: #27343F;
  --c-sage: #8FB097;
  --c-sage-soft: #1B2A22;
  --c-rust: #D9845F;
  --c-rust-soft: #2E1B14;
}
```

**NOTE for the implementer:** the dark `--c-rust` value in the `@media` block above is intentionally written as an invalid token (`#D98straight`) — this is a deliberate defect for you to catch. Correct it to `#D9845F` to match the `[data-theme='dark']` block, then verify both dark paths define an identical token set. Report that you fixed it.

- [ ] **Step 2: Create `src/styles/global.css`**

```css
@import './tokens.css';

*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  background: var(--c-ground);
  color: var(--c-ink);
  font-family: var(--f-ui);
  font-size: var(--t-base);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--f-display);
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -0.015em;
  text-wrap: balance;
  margin: 0;
}

h1 { font-size: var(--t-3xl); }
h2 { font-size: var(--t-2xl); }
h3 { font-size: var(--t-lg); }

p { margin: 0; }

a { color: inherit; text-decoration-color: var(--c-sage); text-underline-offset: 0.18em; }
a:hover { text-decoration-color: var(--c-ink); }

:focus-visible {
  outline: 2px solid var(--c-sage);
  outline-offset: 3px;
  border-radius: 2px;
}

img { max-width: 100%; height: auto; display: block; }

.page-shell {
  max-width: var(--page-max);
  margin-inline: auto;
  padding-inline: var(--s-6);
}

.eyebrow {
  font-family: var(--f-ui);
  font-size: var(--t-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--c-ink-faint);
}

/* Long-form reading */
.prose { font-family: var(--f-prose); font-size: 1.14rem; line-height: 1.72; max-width: var(--measure); }
.prose > * + * { margin-top: var(--s-4); }
.prose h2 { margin-top: var(--s-12); }
.prose h3 { margin-top: var(--s-8); }
.prose blockquote {
  font-style: italic;
  color: var(--c-ink-soft);
  padding-left: var(--s-6);
  border-left: 1px solid var(--c-rule);
  margin-left: 0;
}

/* Any wide element scrolls itself, never the page */
.scroll-x { overflow-x: auto; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  wide?: boolean;
}

const { title, description, wide = false } = Astro.props;
const fullTitle = title === 'Anthropy' ? 'Anthropy' : `${title} · Anthropy`;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Archivo:wght@400;500;600&display=swap"
    />
  </head>
  <body>
    <main id="main" class={wide ? '' : 'page-shell'}>
      <slot />
    </main>
  </body>
</html>
```

- [ ] **Step 4: Rewrite `src/pages/index.astro` to use the layout**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Anthropy" description="Humanities research at UWC Dover.">
  <h1>Anthropy</h1>
</BaseLayout>
```

- [ ] **Step 5: Write the failing theme test**

Create `tests/e2e/theme.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('body paints an explicit background in light mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(251, 249, 244)');
});

test('dark mode redefines the ground token', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(16, 26, 38)');
});

test('explicit light theme beats a dark OS preference', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(251, 249, 244)');
});

test('every token defined in light is also defined in dark', async ({ page }) => {
  const names = [
    '--c-ground', '--c-surface', '--c-sunk', '--c-ink', '--c-ink-soft',
    '--c-ink-faint', '--c-rule', '--c-sage', '--c-sage-soft', '--c-rust', '--c-rust-soft',
  ];
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  for (const name of names) {
    const value = await page.evaluate(
      (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
      name,
    );
    expect(value, `${name} must resolve in dark mode`).toMatch(/^#[0-9A-Fa-f]{6}$/);
  }
});
```

- [ ] **Step 6: Run the tests — expect the invalid token to fail**

Run: `npm run build && npm run test:e2e`
Expected: the fourth test FAILS on `--c-rust` because of the deliberate `#D98straight` defect from Step 1.

- [ ] **Step 7: Fix the token and re-run**

Correct `--c-rust: #D98straight;` to `--c-rust: #D9845F;` in the `@media (prefers-color-scheme: dark)` block of `src/styles/tokens.css`.

Run: `npm run build && npm run test:e2e`
Expected: PASS, all 5 tests (including the Task 1 smoke test).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add design tokens, global styles, and BaseLayout"
```

---

## Task 3: Content collection schemas and seed data

**Files:**
- Create: `src/content.config.ts`
- Create: `src/data/site.json`, `src/data/alumni.json`
- Create: `src/content/journal/2026-inaugural-issue.md`
- Create: `src/content/articles/example-article.md`
- Create: `src/content/events/2025-humanities-focus-week.md`, `src/content/events/2026-forum.md`
- Create: `src/content/leadership/2025-2026.md`
- Test: the Astro build itself — schemas are enforced at build time (see Step 5)

**Interfaces:**
- Consumes: Task 1 scaffold.
- Produces: four collections queryable via `getCollection('journal' | 'articles' | 'events' | 'leadership')`, with the exact frontmatter fields defined below. Later tasks depend on these field names.

**CRITICAL — real-people rule:** Every seed file below uses content explicitly labelled as an example template. Do **not** replace these with invented names, universities, or quotations. Real content is supplied by the Anthropy team later, following `docs/CONTENT-GUIDE.md` (Task 9).

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const journal = defineCollection({
  loader: glob({ base: './src/content/journal', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    issueNumber: z.number().int().positive(),
    publishedAt: z.coerce.date(),
    summary: z.string(),
    pdf: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    publishedAt: z.coerce.date(),
    discipline: z.string(),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

const events = defineCollection({
  loader: glob({ base: './src/content/events', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    /** Display name. The 2026 one-day format's final name is still pending —
     *  it is set here, never hard-coded in a template. */
    name: z.string(),
    year: z.number().int(),
    format: z.enum(['week', 'forum']),
    startsAt: z.coerce.date(),
    summary: z.string(),
    upcoming: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const leadership = defineCollection({
  loader: glob({ base: './src/content/leadership', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    /** Academic year label, e.g. "2025–2026". */
    academicYear: z.string(),
    /** Sort key: the calendar year the academic year starts in. */
    startYear: z.number().int(),
    current: z.boolean().default(false),
    members: z.array(
      z.object({
        name: z.string(),
        role: z.string(),
        campus: z.string().default('UWC Dover'),
        bio: z.string().optional(),
        photo: z.string().optional(),
      }),
    ).default([]),
  }),
});

export const collections = { journal, articles, events, leadership };
```

- [ ] **Step 2: Create `src/data/site.json`**

```json
{
  "name": "Anthropy",
  "established": 2021,
  "tagline": "Fostering early intellectual curiosity and meaningful engagement within the humanities.",
  "basedAt": "UWC South East Asia, Dover Campus",
  "contactEmail": "REPLACE_WITH_REAL_EMAIL",
  "socials": [
    { "label": "LinkedIn", "url": "REPLACE_WITH_REAL_URL" },
    { "label": "Instagram", "url": "REPLACE_WITH_REAL_URL" }
  ]
}
```

- [ ] **Step 3: Create `src/data/alumni.json`**

The proof band is the site's strongest legitimacy signal and its biggest liability if unverified. It ships empty and renders nothing until the team fills it with real, permissioned outcomes.

```json
{
  "outcomes": []
}
```

- [ ] **Step 4: Create the seed content files**

`src/content/journal/2026-inaugural-issue.md`:

```markdown
---
title: "EXAMPLE TEMPLATE — Replace with a real issue title"
issueNumber: 1
publishedAt: 2026-03-01
summary: "EXAMPLE TEMPLATE. This file shows the shape of a journal issue. Replace every field with real content, or delete this file. See docs/CONTENT-GUIDE.md."
draft: true
---

This is an example template file, not real content. It exists so the Journal page
has a shape to render while the team prepares the first real issue.

Replace this body with the issue's introduction, or delete this file entirely.
```

`src/content/articles/example-article.md`:

```markdown
---
title: "EXAMPLE TEMPLATE — Replace with a real paper title"
author: "EXAMPLE TEMPLATE — Replace with the real author"
publishedAt: 2026-03-01
discipline: "History"
summary: "EXAMPLE TEMPLATE. This file shows the shape of an article. Replace every field with real content, or delete this file."
draft: true
---

This is an example template file, not real content.

Replace this body with the article text, or delete this file entirely.
```

`src/content/events/2025-humanities-focus-week.md`:

```markdown
---
name: "Humanities Focus Week"
year: 2025
format: "week"
startsAt: 2025-03-01
summary: "EXAMPLE TEMPLATE — replace with a real description of the 2025 programme, including speakers and sessions."
draft: true
---

Replace this body with a real account of the 2025 Humanities Focus Week.
```

`src/content/events/2026-forum.md`:

```markdown
---
name: "PENDING — the 2026 one-day forum has not been named yet"
year: 2026
format: "forum"
startsAt: 2026-11-01
summary: "EXAMPLE TEMPLATE. This year Humanities Focus Week becomes a single-day forum. Set the real name in the `name` field above once the team decides it."
upcoming: true
draft: true
---

Replace this body once the format and name are confirmed.
```

`src/content/leadership/2025-2026.md`:

```markdown
---
academicYear: "2025–2026"
startYear: 2025
current: true
members: []
---

Roster intentionally empty. Add real team members under `members:` in the frontmatter,
following docs/CONTENT-GUIDE.md. Do not add placeholder people.
```

- [ ] **Step 5: Verify the schemas actually reject bad content**

Astro validates collection frontmatter at build time, so **the build is the test**. Prove it rejects invalid content rather than trusting that it does.

Temporarily break one file — `issueNumber` must be a positive integer:

```bash
sed -i '' 's/^issueNumber: 1$/issueNumber: "one"/' src/content/journal/2026-inaugural-issue.md
npm run build
```

Expected: build FAILS with a Zod error naming `issueNumber` in `2026-inaugural-issue.md`.

- [ ] **Step 6: Restore the file and confirm a clean build**

```bash
sed -i '' 's/^issueNumber: "one"$/issueNumber: 1/' src/content/journal/2026-inaugural-issue.md
npm run build
```

Expected: build SUCCEEDS. All four collections load and all seed frontmatter satisfies its schema.

If the build fails here, the seed frontmatter and the schema disagree — fix the mismatch before continuing.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: define content collection schemas with template seed data"
```

---

## Task 4: Collection helpers

**Files:**
- Create: `src/lib/collections.ts`
- Modify: `src/lib/format.ts`
- Test: `tests/unit/collections.test.ts`, `tests/unit/format.test.ts`

**Interfaces:**
- Consumes: schema field names from Task 3.
- Produces:
  - `sortByDateDesc<T>(items: T[], key: (item: T) => Date): T[]`
  - `excludeDrafts<T extends { data: { draft?: boolean } }>(items: T[]): T[]`
  - `formatEventDate(date: Date): string` from `src/lib/format.ts`

These are pure functions so they carry real unit tests; every page in Tasks 5–8 uses them.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/collections.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { sortByDateDesc, excludeDrafts } from '../../src/lib/collections';

const entry = (id: string, draft = false) => ({ id, data: { draft } });

describe('sortByDateDesc', () => {
  it('orders newest first', () => {
    const items = [
      { id: 'old', when: new Date('2024-01-01') },
      { id: 'new', when: new Date('2026-01-01') },
      { id: 'mid', when: new Date('2025-01-01') },
    ];
    expect(sortByDateDesc(items, (i) => i.when).map((i) => i.id))
      .toEqual(['new', 'mid', 'old']);
  });

  it('does not mutate the input array', () => {
    const items = [
      { id: 'a', when: new Date('2024-01-01') },
      { id: 'b', when: new Date('2026-01-01') },
    ];
    sortByDateDesc(items, (i) => i.when);
    expect(items.map((i) => i.id)).toEqual(['a', 'b']);
  });

  it('returns an empty array unchanged', () => {
    expect(sortByDateDesc([], (i: { when: Date }) => i.when)).toEqual([]);
  });
});

describe('excludeDrafts', () => {
  it('removes entries flagged as draft', () => {
    const items = [entry('live'), entry('wip', true)];
    expect(excludeDrafts(items).map((i) => i.id)).toEqual(['live']);
  });

  it('keeps entries with no draft flag', () => {
    const items = [{ id: 'x', data: {} }];
    expect(excludeDrafts(items)).toHaveLength(1);
  });

  it('returns an empty array unchanged', () => {
    expect(excludeDrafts([])).toEqual([]);
  });
});
```

Append to `tests/unit/format.test.ts`:

```ts
import { formatEventDate } from '../../src/lib/format';

describe('formatEventDate', () => {
  it('formats as "D Month YYYY" in UTC', () => {
    expect(formatEventDate(new Date('2026-11-14T00:00:00Z'))).toBe('14 November 2026');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test:unit`
Expected: FAIL — `src/lib/collections` unresolved, `formatEventDate` not exported.

- [ ] **Step 3: Implement `src/lib/collections.ts`**

```ts
/** Returns a new array ordered newest-first by the extracted date. */
export function sortByDateDesc<T>(items: T[], key: (item: T) => Date): T[] {
  return [...items].sort((a, b) => key(b).getTime() - key(a).getTime());
}

/** Drops entries whose frontmatter marks them as a draft. */
export function excludeDrafts<T extends { data: { draft?: boolean } }>(items: T[]): T[] {
  return items.filter((item) => !item.data.draft);
}

```

- [ ] **Step 4: Add `formatEventDate` to `src/lib/format.ts`**

```ts
/** Formats a date as "D Month YYYY" in UTC. */
export function formatEventDate(date: Date): string {
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm run test:unit`
Expected: PASS, 9 tests.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add collection sorting, filtering, and grouping helpers"
```

---

## Task 5: Site chrome — header, footer, SEO

**Files:**
- Create: `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/components/Seo.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Test: `tests/e2e/chrome.spec.ts`

**Interfaces:**
- Consumes: `src/data/site.json` (Task 3), `BaseLayout` (Task 2).
- Produces: `BaseLayout` now renders header + footer around its slot. Nav order encodes audience priority from spec §3.

**Nav order rationale (spec §3):** the homepage leads with outside legitimacy, so nav reads Journal → Articles → Events → In2Academia → Leadership → About → Contact. Proof of output comes before the invitation to join.

- [ ] **Step 1: Create `src/components/Seo.astro`**

```astro
---
interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site).href;
---
<link rel="canonical" href={canonical} />
<meta property="og:site_name" content="Anthropy" />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta name="twitter:card" content="summary_large_image" />
```

- [ ] **Step 2: Create `src/components/SiteHeader.astro`**

```astro
---
const links = [
  { href: '/journal/', label: 'Journal' },
  { href: '/articles/', label: 'Articles' },
  { href: '/events/', label: 'Events' },
  { href: '/in2academia/', label: 'In2Academia' },
  { href: '/leadership/', label: 'Leadership' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];
const here = Astro.url.pathname;
---
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="page-shell bar">
    <a class="wordmark" href="/">Anthropy</a>
    <nav aria-label="Primary">
      <ul>
        {links.map((link) => (
          <li>
            <a href={link.href} aria-current={here.startsWith(link.href) ? 'page' : undefined}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </div>
</header>

<style>
  .skip {
    position: absolute;
    left: -9999px;
  }
  .skip:focus {
    left: var(--s-4);
    top: var(--s-4);
    z-index: 10;
    background: var(--c-surface);
    padding: var(--s-2) var(--s-4);
  }
  .site-header {
    border-bottom: 1px solid var(--c-rule);
    background: var(--c-ground);
  }
  .bar {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--s-4);
    padding-block: var(--s-4);
  }
  .wordmark {
    font-family: var(--f-display);
    font-weight: 700;
    font-size: var(--t-lg);
    letter-spacing: -0.02em;
    text-decoration: none;
  }
  nav ul {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-4);
    list-style: none;
    margin: 0;
    padding: 0;
  }
  nav a {
    font-size: var(--t-sm);
    color: var(--c-ink-soft);
    text-decoration: none;
  }
  nav a:hover { color: var(--c-ink); }
  nav a[aria-current='page'] {
    color: var(--c-ink);
    text-decoration: underline;
    text-decoration-color: var(--c-sage);
    text-underline-offset: 0.3em;
  }
</style>
```

- [ ] **Step 3: Create `src/components/SiteFooter.astro`**

```astro
---
import site from '../data/site.json';
const year = new Date().getUTCFullYear();
const socials = site.socials.filter((s) => !s.url.startsWith('REPLACE_WITH'));
const hasEmail = !site.contactEmail.startsWith('REPLACE_WITH');
---
<footer class="site-footer">
  <div class="page-shell inner">
    <p class="tagline">{site.tagline}</p>
    <div class="meta">
      <span>{site.name} · Established {site.established} · {site.basedAt}</span>
      {hasEmail && <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>}
      {socials.length > 0 && (
        <ul>
          {socials.map((s) => (
            <li><a href={s.url}>{s.label}</a></li>
          ))}
        </ul>
      )}
      <span class="copy">© {year} {site.name}</span>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    border-top: 1px solid var(--c-rule);
    margin-top: var(--s-24);
    padding-block: var(--s-12);
    background: var(--c-sunk);
  }
  .inner { display: grid; gap: var(--s-6); }
  .tagline {
    font-family: var(--f-prose);
    font-size: var(--t-lg);
    font-style: italic;
    color: var(--c-ink-soft);
    max-width: 46ch;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-2) var(--s-6);
    font-size: var(--t-sm);
    color: var(--c-ink-faint);
  }
  .meta ul {
    display: flex;
    gap: var(--s-4);
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
```

- [ ] **Step 4: Wire chrome into `src/layouts/BaseLayout.astro`**

Replace the file with:

```astro
---
import '../styles/global.css';
import Seo from '../components/Seo.astro';
import SiteHeader from '../components/SiteHeader.astro';
import SiteFooter from '../components/SiteFooter.astro';

interface Props {
  title: string;
  description: string;
  wide?: boolean;
}

const { title, description, wide = false } = Astro.props;
const fullTitle = title === 'Anthropy' ? 'Anthropy' : `${title} · Anthropy`;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Archivo:wght@400;500;600&display=swap"
    />
    <Seo title={fullTitle} description={description} />
  </head>
  <body>
    <SiteHeader />
    <main id="main" class={wide ? '' : 'page-shell'}>
      <slot />
    </main>
    <SiteFooter />
  </body>
</html>
```

- [ ] **Step 5: Write the failing chrome test**

Create `tests/e2e/chrome.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const NAV = ['Journal', 'Articles', 'Events', 'In2Academia', 'Leadership', 'About', 'Contact'];

test('primary nav lists every section in audience-priority order', async ({ page }) => {
  await page.goto('/');
  const labels = await page.locator('nav[aria-label="Primary"] a').allTextContents();
  expect(labels.map((l) => l.trim())).toEqual(NAV);
});

test('footer shows the tagline and does not render placeholder contact details', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.tagline')).toContainText('intellectual curiosity');
  await expect(page.locator('footer')).not.toContainText('REPLACE_WITH');
});

test('skip link is the first focusable element', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveText('Skip to content');
});

test('page has a canonical url', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://anthropy.wetkarma.com/',
  );
});
```

- [ ] **Step 6: Run the tests**

Run: `npm run build && npm run test:e2e`
Expected: PASS, all four tests. They assert only on the homepage, which exists. The nav links themselves will 404 until Tasks 6–8 create those routes; Task 8 adds the test that every route resolves.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add site header, footer, and SEO metadata"
```

---

## Task 6: Homepage with proof band

**Files:**
- Create: `src/components/ProofBand.astro`, `src/components/CollectionGrid.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: `sortByDateDesc`, `excludeDrafts` (Task 4); `journal`/`articles`/`events` collections (Task 3); `alumni.json` (Task 3).
- Produces: `CollectionGrid.astro` with props `{ items: Array<{ href: string; title: string; meta: string; summary: string }>; emptyMessage: string }`, reused by Tasks 7 and 8.

**Spec §3:** the homepage leads with proof, not invitation. Order: thesis statement → proof band (alumni outcomes) → recent published work → programmes → invitation last.

- [ ] **Step 1: Create `src/components/ProofBand.astro`**

Renders nothing when `alumni.json` is empty — the site must never show fabricated outcomes.

```astro
---
import alumni from '../data/alumni.json';

interface Outcome {
  name: string;
  destination: string;
  note?: string;
}

const outcomes = alumni.outcomes as Outcome[];
---
{outcomes.length > 0 && (
  <section class="proof" aria-labelledby="proof-heading">
    <p class="eyebrow" id="proof-heading">Where our contributors go next</p>
    <ul>
      {outcomes.map((o) => (
        <li>
          <span class="dest">{o.destination}</span>
          <span class="who">{o.name}</span>
          {o.note && <span class="note">{o.note}</span>}
        </li>
      ))}
    </ul>
  </section>
)}

<style>
  .proof {
    border-block: 1px solid var(--c-rule);
    padding-block: var(--s-8);
    display: grid;
    gap: var(--s-6);
  }
  .proof ul {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--s-6);
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .proof li { display: grid; gap: var(--s-1); }
  .dest {
    font-family: var(--f-display);
    font-size: var(--t-lg);
    color: var(--c-ink);
  }
  .who { font-size: var(--t-sm); color: var(--c-ink-soft); }
  .note { font-size: var(--t-xs); color: var(--c-ink-faint); }
</style>
```

- [ ] **Step 2: Create `src/components/CollectionGrid.astro`**

Must read as intentional at one item and at thirty — hence `auto-fit` with a generous minimum rather than a fixed column count.

```astro
---
interface Item {
  href: string;
  title: string;
  meta: string;
  summary: string;
}

interface Props {
  items: Item[];
  emptyMessage: string;
}

const { items, emptyMessage } = Astro.props;
---
{items.length === 0 ? (
  <p class="empty">{emptyMessage}</p>
) : (
  <ul class="grid">
    {items.map((item) => (
      <li>
        <article>
          <p class="eyebrow">{item.meta}</p>
          <h3><a href={item.href}>{item.title}</a></h3>
          <p class="summary">{item.summary}</p>
        </article>
      </li>
    ))}
  </ul>
)}

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--s-8);
    list-style: none;
    margin: 0;
    padding: 0;
  }
  article {
    display: grid;
    gap: var(--s-2);
    padding-top: var(--s-4);
    border-top: 1px solid var(--c-rule);
    height: 100%;
  }
  h3 { font-size: var(--t-lg); }
  h3 a { text-decoration: none; }
  h3 a:hover { text-decoration: underline; text-decoration-color: var(--c-sage); }
  .summary {
    font-family: var(--f-prose);
    color: var(--c-ink-soft);
    max-width: 42ch;
  }
  .empty {
    font-family: var(--f-prose);
    font-style: italic;
    color: var(--c-ink-faint);
    padding-block: var(--s-8);
    max-width: var(--measure);
  }
</style>
```

- [ ] **Step 3: Rewrite `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import ProofBand from '../components/ProofBand.astro';
import CollectionGrid from '../components/CollectionGrid.astro';
import { excludeDrafts, sortByDateDesc } from '../lib/collections';
import { formatIssueDate, formatEventDate } from '../lib/format';
import site from '../data/site.json';

const articles = sortByDateDesc(
  excludeDrafts(await getCollection('articles')),
  (a) => a.data.publishedAt,
).slice(0, 3);

const issues = sortByDateDesc(
  excludeDrafts(await getCollection('journal')),
  (i) => i.data.publishedAt,
).slice(0, 2);

const upcoming = excludeDrafts(await getCollection('events'))
  .filter((e) => e.data.upcoming);

const articleItems = articles.map((a) => ({
  href: `/articles/${a.id}/`,
  title: a.data.title,
  meta: `${a.data.discipline} · ${formatIssueDate(a.data.publishedAt)}`,
  summary: a.data.summary,
}));

const issueItems = issues.map((i) => ({
  href: `/journal/${i.id}/`,
  title: i.data.title,
  meta: `Issue ${i.data.issueNumber} · ${formatIssueDate(i.data.publishedAt)}`,
  summary: i.data.summary,
}));
---
<BaseLayout
  title="Anthropy"
  description="Anthropy is a student-led humanities research organization at UWC Dover. We publish student research and bring academics into conversation with the students who will follow them."
>
  <section class="thesis">
    <p class="eyebrow">Humanities research · UWC Dover · Est. {site.established}</p>
    <h1>We do not set out to change the humanities. We set out to prepare the people who will.</h1>
    <p class="lede">
      Anthropy runs a research programme, publishes a student academic journal, and brings
      working academics into direct conversation with secondary students. Everything here is
      produced by students who were learning to do research when they started.
    </p>
  </section>

  <ProofBand />

  <section class="block">
    <h2>Recent work</h2>
    <CollectionGrid
      items={articleItems}
      emptyMessage="The first papers of this cycle are being prepared for publication."
    />
  </section>

  <section class="block">
    <h2>The journal</h2>
    <CollectionGrid
      items={issueItems}
      emptyMessage="The inaugural issue is in preparation."
    />
  </section>

  <section class="block programmes">
    <h2>What we run</h2>
    <div class="two">
      <article>
        <h3><a href="/in2academia/">In2Academia</a></h3>
        <p>
          A ten-week programme teaching secondary students how to actually conduct humanities
          research — from question to argument to a paper that gets published.
        </p>
      </article>
      <article>
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
</BaseLayout>

<style>
  .thesis {
    display: grid;
    gap: var(--s-6);
    padding-block: var(--s-24) var(--s-16);
    max-width: 20ch;
    max-width: min(100%, 22ch);
  }
  .thesis h1 { max-width: 18ch; }
  .lede {
    font-family: var(--f-prose);
    font-size: var(--t-lg);
    color: var(--c-ink-soft);
    max-width: 52ch;
  }
  .block {
    display: grid;
    gap: var(--s-6);
    padding-block: var(--s-16);
  }
  .two {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--s-8);
  }
  .two article { display: grid; gap: var(--s-2); }
  .two p { font-family: var(--f-prose); color: var(--c-ink-soft); max-width: 46ch; }
  .two h3 a { text-decoration: none; }
</style>
```

**NOTE for the implementer:** `.thesis` above contains a duplicated `max-width` declaration (`20ch` then `min(100%, 22ch)`), and the value is far too narrow for a section containing a lede paragraph — it will visibly squash the hero. Remove both and let the child elements own their measures. Report that you fixed it.

- [ ] **Step 4: Write the failing homepage test**

Create `tests/e2e/home.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('leads with the thesis, not an invitation to join', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('prepare the people who will');
});

test('proof band is absent while alumni data is empty', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.proof')).toHaveCount(0);
});

test('empty collections render an intentional message, not a broken grid', async ({ page }) => {
  await page.goto('/');
  const empties = page.locator('.empty');
  await expect(empties.first()).toBeVisible();
});

test('hero is not squashed into a narrow column', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  const width = await page.locator('.lede').evaluate((el) => el.getBoundingClientRect().width);
  expect(width).toBeGreaterThan(400);
});

test('no placeholder markers leak into the rendered page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).not.toContainText('EXAMPLE TEMPLATE');
  await expect(page.locator('body')).not.toContainText('REPLACE_WITH');
});
```

- [ ] **Step 5: Run the tests — expect the squash test to fail**

Run: `npm run build && npm run test:e2e`
Expected: `hero is not squashed` FAILS due to the deliberate `max-width` defect in Step 3.

- [ ] **Step 6: Fix the defect and re-run**

Remove both `max-width` lines from the `.thesis` rule in `src/pages/index.astro`.

Run: `npm run build && npm run test:e2e`
Expected: PASS, all tests.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: build legitimacy-first homepage with proof band and collection grid"
```

---

## Task 7: Journal and Articles sections

**Files:**
- Create: `src/layouts/ProseLayout.astro`
- Create: `src/pages/journal/index.astro`, `src/pages/journal/[...slug].astro`
- Create: `src/pages/articles/index.astro`, `src/pages/articles/[...slug].astro`
- Test: `tests/e2e/publications.spec.ts`

**Interfaces:**
- Consumes: `CollectionGrid` (Task 6), `sortByDateDesc`/`excludeDrafts` (Task 4), `formatIssueDate` (Task 1).
- Produces: `ProseLayout.astro` with props `{ title: string; description: string; eyebrow: string; byline?: string }`, reused by Task 8.

- [ ] **Step 1: Create `src/layouts/ProseLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  description: string;
  eyebrow: string;
  byline?: string;
}

const { title, description, eyebrow, byline } = Astro.props;
---
<BaseLayout title={title} description={description}>
  <article class="doc">
    <header>
      <p class="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {byline && <p class="byline">{byline}</p>}
    </header>
    <div class="prose">
      <slot />
    </div>
  </article>
</BaseLayout>

<style>
  .doc {
    padding-block: var(--s-16);
    display: grid;
    gap: var(--s-12);
  }
  header { display: grid; gap: var(--s-3); max-width: var(--measure); }
  h1 { font-size: var(--t-2xl); }
  .byline {
    font-family: var(--f-prose);
    font-style: italic;
    color: var(--c-ink-soft);
  }
</style>
```

- [ ] **Step 2: Create `src/pages/journal/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import CollectionGrid from '../../components/CollectionGrid.astro';
import { excludeDrafts, sortByDateDesc } from '../../lib/collections';
import { formatIssueDate } from '../../lib/format';

const issues = sortByDateDesc(
  excludeDrafts(await getCollection('journal')),
  (i) => i.data.publishedAt,
);

const items = issues.map((i) => ({
  href: `/journal/${i.id}/`,
  title: i.data.title,
  meta: `Issue ${i.data.issueNumber} · ${formatIssueDate(i.data.publishedAt)}`,
  summary: i.data.summary,
}));
---
<BaseLayout
  title="Journal"
  description="The Anthropy Academic Journal collects peer-supported research written by secondary students."
>
  <section class="head">
    <p class="eyebrow">Publication</p>
    <h1>The Anthropy Academic Journal</h1>
    <p class="lede">
      Each issue collects research written by students in the In2Academia programme and
      edited with academic mentors.
    </p>
  </section>
  <CollectionGrid
    items={items}
    emptyMessage="The inaugural issue is in preparation. Check back, or write to us if you would like to contribute."
  />
</BaseLayout>

<style>
  .head { display: grid; gap: var(--s-4); padding-block: var(--s-16) var(--s-8); }
  .lede { font-family: var(--f-prose); font-size: var(--t-lg); color: var(--c-ink-soft); max-width: 52ch; }
</style>
```

- [ ] **Step 3: Create `src/pages/journal/[...slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import ProseLayout from '../../layouts/ProseLayout.astro';
import { excludeDrafts } from '../../lib/collections';
import { formatIssueDate } from '../../lib/format';

export async function getStaticPaths() {
  const issues = excludeDrafts(await getCollection('journal'));
  return issues.map((issue) => ({
    params: { slug: issue.id },
    props: { issue },
  }));
}

const { issue } = Astro.props;
const { Content } = await render(issue);
---
<ProseLayout
  title={issue.data.title}
  description={issue.data.summary}
  eyebrow={`Issue ${issue.data.issueNumber} · ${formatIssueDate(issue.data.publishedAt)}`}
>
  <Content />
  {issue.data.pdf && (
    <p><a href={issue.data.pdf}>Download the full issue (PDF)</a></p>
  )}
</ProseLayout>
```

- [ ] **Step 4: Create `src/pages/articles/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import CollectionGrid from '../../components/CollectionGrid.astro';
import { excludeDrafts, sortByDateDesc } from '../../lib/collections';
import { formatIssueDate } from '../../lib/format';

const articles = sortByDateDesc(
  excludeDrafts(await getCollection('articles')),
  (a) => a.data.publishedAt,
);

const items = articles.map((a) => ({
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
  <CollectionGrid
    items={items}
    emptyMessage="Papers from this cycle are being finalised for publication."
  />
</BaseLayout>

<style>
  .head { display: grid; gap: var(--s-4); padding-block: var(--s-16) var(--s-8); }
  .lede { font-family: var(--f-prose); font-size: var(--t-lg); color: var(--c-ink-soft); max-width: 52ch; }
</style>
```

- [ ] **Step 5: Create `src/pages/articles/[...slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import ProseLayout from '../../layouts/ProseLayout.astro';
import { excludeDrafts } from '../../lib/collections';
import { formatIssueDate } from '../../lib/format';

export async function getStaticPaths() {
  const articles = excludeDrafts(await getCollection('articles'));
  return articles.map((article) => ({
    params: { slug: article.id },
    props: { article },
  }));
}

const { article } = Astro.props;
const { Content } = await render(article);
---
<ProseLayout
  title={article.data.title}
  description={article.data.summary}
  eyebrow={`${article.data.discipline} · ${formatIssueDate(article.data.publishedAt)}`}
  byline={`By ${article.data.author}`}
>
  <Content />
</ProseLayout>
```

- [ ] **Step 6: Write the failing publications test**

Create `tests/e2e/publications.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('journal index renders with an intentional empty state', async ({ page }) => {
  await page.goto('/journal/');
  await expect(page.locator('h1')).toContainText('Academic Journal');
  await expect(page.locator('.empty')).toBeVisible();
});

test('articles index renders with an intentional empty state', async ({ page }) => {
  await page.goto('/articles/');
  await expect(page.locator('h1')).toHaveText('Articles');
  await expect(page.locator('.empty')).toBeVisible();
});

test('draft seed content is not published as a route', async ({ page }) => {
  const response = await page.goto('/articles/example-article/');
  expect(response?.status()).toBe(404);
});

test('publication pages never leak template markers', async ({ page }) => {
  for (const path of ['/journal/', '/articles/']) {
    await page.goto(path);
    await expect(page.locator('body')).not.toContainText('EXAMPLE TEMPLATE');
  }
});
```

- [ ] **Step 7: Run the tests**

Run: `npm run build && npm run test:e2e`
Expected: PASS. All seed content is `draft: true`, so both indexes show empty states and no detail routes are generated.

- [ ] **Step 8: Verify detail pages render by temporarily un-drafting**

```bash
sed -i '' 's/^draft: true$/draft: false/' src/content/articles/example-article.md
npm run build
```

Confirm `dist/articles/example-article/index.html` exists, then revert:

```bash
sed -i '' 's/^draft: false$/draft: true/' src/content/articles/example-article.md
npm run build && npm run test:e2e
```

Expected: the route builds when un-drafted, and tests pass again after reverting.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add journal and articles index and detail pages"
```

---

## Task 8: Events, Leadership, and the static pages

**Files:**
- Create: `src/pages/events/index.astro`, `src/pages/events/[...slug].astro`
- Create: `src/pages/leadership.astro`
- Create: `src/pages/about.astro`, `src/pages/in2academia.astro`, `src/pages/contact.astro`
- Test: `tests/e2e/sections.spec.ts`

**Interfaces:**
- Consumes: `ProseLayout` (Task 7), `CollectionGrid` (Task 6), `sortByDateDesc`/`excludeDrafts` (Task 4), `formatEventDate` (Task 4).
- Produces: every nav route from Task 5 now resolves.

**Constraint reminder:** the 2026 one-day event's name comes from the `name` frontmatter field. No template may contain a guessed name for it.

- [ ] **Step 1: Create `src/pages/events/index.astro`**

Must hold multi-year HFW history and the new one-day format without reading as inconsistent programming — so the page states the change explicitly rather than letting the reader infer it.

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import CollectionGrid from '../../components/CollectionGrid.astro';
import { excludeDrafts, sortByDateDesc } from '../../lib/collections';
import { formatEventDate } from '../../lib/format';

const all = sortByDateDesc(
  excludeDrafts(await getCollection('events')),
  (e) => e.data.startsAt,
);

const upcoming = all.filter((e) => e.data.upcoming);
const past = all.filter((e) => !e.data.upcoming);

const toItem = (e: (typeof all)[number]) => ({
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

  {upcoming.length > 0 && (
    <section class="block">
      <h2>Next</h2>
      <CollectionGrid items={upcoming.map(toItem)} emptyMessage="" />
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

- [ ] **Step 2: Create `src/pages/events/[...slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import ProseLayout from '../../layouts/ProseLayout.astro';
import { excludeDrafts } from '../../lib/collections';
import { formatEventDate } from '../../lib/format';

export async function getStaticPaths() {
  const events = excludeDrafts(await getCollection('events'));
  return events.map((event) => ({
    params: { slug: event.id },
    props: { event },
  }));
}

const { event } = Astro.props;
const { Content } = await render(event);
const kind = event.data.format === 'week' ? 'Week-long programme' : 'One-day forum';
---
<ProseLayout
  title={event.data.name}
  description={event.data.summary}
  eyebrow={`${kind} · ${formatEventDate(event.data.startsAt)}`}
>
  <Content />
</ProseLayout>
```

- [ ] **Step 3: Create `src/pages/leadership.astro`**

Years are rendered as sections with in-page anchors rather than JavaScript tabs — no JS, deep-linkable, and works at one year or at ten.

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';

const years = (await getCollection('leadership')).sort(
  (a, b) => b.data.startYear - a.data.startYear,
);
const current = years.find((y) => y.data.current) ?? years[0];
const previous = years.filter((y) => y.id !== current?.id);
---
<BaseLayout
  title="Leadership"
  description="The students who lead Anthropy, and those who led it before them."
>
  <section class="head">
    <p class="eyebrow">The team</p>
    <h1>Leadership</h1>
  </section>

  {years.length > 1 && (
    <nav class="years" aria-label="Leadership years">
      <ul>
        {years.map((y) => (
          <li><a href={`#year-${y.data.startYear}`}>{y.data.academicYear}</a></li>
        ))}
      </ul>
    </nav>
  )}

  {current && (
    <section class="year" id={`year-${current.data.startYear}`}>
      <h2>{current.data.academicYear}</h2>
      {current.data.members.length === 0 ? (
        <p class="empty">This year's team is being confirmed.</p>
      ) : (
        <ul class="people">
          {current.data.members.map((m) => (
            <li>
              <p class="name">{m.name}</p>
              <p class="role">{m.role}</p>
              <p class="campus">{m.campus}</p>
              {m.bio && <p class="bio">{m.bio}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )}

  {previous.map((y) => (
    <section class="year" id={`year-${y.data.startYear}`}>
      <h2>{y.data.academicYear}</h2>
      {y.data.members.length === 0 ? (
        <p class="empty">Roster not yet recorded.</p>
      ) : (
        <ul class="people">
          {y.data.members.map((m) => (
            <li>
              <p class="name">{m.name}</p>
              <p class="role">{m.role}</p>
              <p class="campus">{m.campus}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  ))}
</BaseLayout>

<style>
  .head { display: grid; gap: var(--s-4); padding-block: var(--s-16) var(--s-8); }
  .years ul {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-4);
    list-style: none;
    margin: 0 0 var(--s-8);
    padding: 0;
    font-size: var(--t-sm);
  }
  .year { padding-block: var(--s-8); border-top: 1px solid var(--c-rule); display: grid; gap: var(--s-6); }
  .people {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--s-8);
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .people li { display: grid; gap: var(--s-1); }
  .name { font-family: var(--f-display); font-size: var(--t-lg); }
  .role { font-size: var(--t-sm); color: var(--c-sage); }
  .campus { font-size: var(--t-xs); color: var(--c-ink-faint); }
  .bio { font-family: var(--f-prose); color: var(--c-ink-soft); margin-top: var(--s-2); }
  .empty { font-family: var(--f-prose); font-style: italic; color: var(--c-ink-faint); }
</style>
```

- [ ] **Step 4: Create `src/pages/about.astro`**

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
  <p>
    Anthropy is a student-led organization for humanities research. We are based at UWC
    South East Asia's Dover Campus, with contributors from UWC East and from outside
    Singapore.
  </p>
  <p>
    We exist because the distance between being interested in the humanities and doing
    humanities research is larger than it should be, and almost nothing bridges it at
    secondary school. A student who is curious about political theory or economic history
    is usually told to wait until university. We think that is a waste of several years of
    genuine intellectual appetite.
  </p>

  <h2>What we do</h2>
  <p>
    <strong>In2Academia</strong> is our research programme. Over ten weeks and ten
    workshops, students move from a vague interest to a defined research question to a
    finished paper, working alongside academic mentors. Strong papers are published in our
    academic journal.
  </p>
  <p>
    <strong>Humanities Focus</strong> is our speaker programme. We bring researchers,
    academics, and professionals in to speak directly with students — not as a careers
    talk, but as a conversation about what the work actually involves.
  </p>

  <h2>What we are not</h2>
  <p>
    We are not a think tank, and we do not claim our students' work changes fields. The
    point is the other direction: the students who learn to do this work properly now are
    the ones who will change those fields later. The journal exists so that work is taken
    seriously, and so the people who wrote it can point to it.
  </p>
</ProseLayout>
```

- [ ] **Step 5: Create `src/pages/in2academia.astro`**

```astro
---
import ProseLayout from '../layouts/ProseLayout.astro';
---
<ProseLayout
  title="In2Academia"
  description="A ten-week programme teaching secondary students how to conduct humanities research and publish a paper."
  eyebrow="Research programme"
>
  <p>
    In2Academia is a ten-week programme that teaches secondary students how to do
    humanities research properly — and then has them do it.
  </p>

  <h2>How it works</h2>
  <p>
    Ten workshops across roughly two months take you from an area of interest to a
    researchable question, through source work and argument construction, to a finished
    paper. You work with academic mentors and with other students doing the same thing.
  </p>

  <h2>What you come away with</h2>
  <p>
    A completed research paper, and the possibility of publication in the Anthropy
    Academic Journal. More durably: you will know how to find a question worth asking,
    how to read a source critically, and how to build an argument that survives contact
    with someone who disagrees.
  </p>

  <h2>Disciplines</h2>
  <p>
    Politics, society, history, economics, culture, and whatever else you can make a
    serious case for.
  </p>

  <h2>Joining</h2>
  <p>
    Applications open at the start of each cycle and are announced across our channels.
    If you want to know when the next one opens, <a href="/contact/">get in touch</a>.
  </p>
</ProseLayout>
```

- [ ] **Step 6: Create `src/pages/contact.astro`**

Speaker inquiries are a first-class path per spec §5, so they are a named route rather than a generic form field.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import site from '../data/site.json';

const hasEmail = !site.contactEmail.startsWith('REPLACE_WITH');
const socials = site.socials.filter((s) => !s.url.startsWith('REPLACE_WITH'));
---
<BaseLayout
  title="Contact"
  description="Get in touch with Anthropy — for speaking, for joining In2Academia, or for anything else."
>
  <section class="head">
    <p class="eyebrow">Contact</p>
    <h1>Get in touch</h1>
  </section>

  <div class="routes">
    <article>
      <h2>Speaking with us</h2>
      <p>
        If you are a researcher or academic interested in speaking at Humanities Focus, we
        would like to hear from you. Tell us roughly what you work on — we will handle the
        rest.
      </p>
    </article>
    <article>
      <h2>Joining In2Academia</h2>
      <p>
        Students who want to know when the next programme cycle opens can write to us, or
        follow our channels for the announcement.
      </p>
    </article>
    <article>
      <h2>Everything else</h2>
      <p>Questions from teachers, schools, and anyone curious about what we do.</p>
    </article>
  </div>

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
</BaseLayout>

<style>
  .head { display: grid; gap: var(--s-4); padding-block: var(--s-16) var(--s-8); }
  .routes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: var(--s-8);
    padding-block: var(--s-8);
  }
  .routes article { display: grid; gap: var(--s-2); }
  .routes h2 { font-size: var(--t-lg); }
  .routes p { font-family: var(--f-prose); color: var(--c-ink-soft); max-width: 40ch; }
  .how { padding-block: var(--s-12); display: grid; gap: var(--s-4); border-top: 1px solid var(--c-rule); }
  .email { font-family: var(--f-display); font-size: var(--t-xl); }
  .how ul { display: flex; gap: var(--s-6); list-style: none; margin: 0; padding: 0; }
  .empty { font-family: var(--f-prose); font-style: italic; color: var(--c-ink-faint); }
</style>
```

- [ ] **Step 7: Write the failing sections test**

Create `tests/e2e/sections.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const ROUTES = [
  '/', '/journal/', '/articles/', '/events/',
  '/in2academia/', '/leadership/', '/about/', '/contact/',
];

test('every nav route resolves with a 200', async ({ page }) => {
  for (const route of ROUTES) {
    const response = await page.goto(route);
    expect(response?.status(), `${route} should resolve`).toBe(200);
  }
});

test('every page has exactly one h1', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    await expect(page.locator('h1'), `${route} needs one h1`).toHaveCount(1);
  }
});

test('no page leaks template or placeholder markers', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    await expect(page.locator('body'), route).not.toContainText('EXAMPLE TEMPLATE');
    await expect(page.locator('body'), route).not.toContainText('REPLACE_WITH');
    await expect(page.locator('body'), route).not.toContainText('PENDING —');
  }
});

test('events page explains the week-to-forum change rather than implying inconsistency', async ({ page }) => {
  await page.goto('/events/');
  await expect(page.locator('.lede')).toContainText('single-day forum');
});

test('no page describes Anthropy as multi-campus', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    const text = (await page.locator('body').innerText()).toLowerCase();
    expect(text, route).not.toContain('multi-campus');
    expect(text, route).not.toContain('campuses across');
  }
});

test('leadership page shows an empty roster state, not invented people', async ({ page }) => {
  await page.goto('/leadership/');
  await expect(page.locator('.empty')).toBeVisible();
});

test('page body never scrolls horizontally at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 720 });
  for (const route of ROUTES) {
    await page.goto(route);
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflows, `${route} overflows horizontally`).toBe(false);
  }
});
```

- [ ] **Step 8: Run the tests**

Run: `npm run build && npm run test:e2e`
Expected: PASS. If the horizontal-overflow test fails on any route, fix the offending element by constraining it or wrapping it in `.scroll-x` — do not suppress the test.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add events, leadership, about, in2academia, and contact pages"
```

---

## Task 9: The revision effect, deploy, and handoff documentation

**Files:**
- Create: `src/components/RevisionReveal.astro`
- Modify: `src/pages/index.astro`, `src/pages/about.astro`
- Create: `scripts/deploy.sh`, `docs/CONTENT-GUIDE.md`, `README.md`
- Test: `tests/e2e/revision.spec.ts`

**Interfaces:**
- Consumes: everything prior.
- Produces: `RevisionReveal.astro` with props `{ from: string; to: string }` — renders `to` as the final text, with `from` shown struck through until revealed.

**Spec §7:** the "live editing" effect is contained to a few deliberate moments, not ambient site-wide behavior. Thesis: *research is revision*. Two placements only — the homepage thesis and the About page's "what we are not" turn. It must render the final text with no JavaScript and under `prefers-reduced-motion`.

- [ ] **Step 1: Create `src/components/RevisionReveal.astro`**

```astro
---
interface Props {
  from: string;
  to: string;
}
const { from, to } = Astro.props;
---
<span class="revision" data-revision data-from={from}>
  <span class="struck" aria-hidden="true"></span><span class="final">{to}</span>
</span>

<style>
  .revision { position: relative; }
  .struck {
    color: var(--c-ink-faint);
    text-decoration: line-through;
    text-decoration-color: var(--c-rust);
    text-decoration-thickness: 2px;
    margin-right: 0.3em;
    display: none;
  }
  /* inline-block, not inline: the strike keyframe animates max-width,
     which has no effect on a non-replaced inline element. */
  .revision[data-armed='true'] .struck { display: inline-block; }
  .revision[data-armed='true'] .final {
    background-image: linear-gradient(var(--c-sage-soft), var(--c-sage-soft));
    background-repeat: no-repeat;
    background-size: 0% 100%;
  }
  .revision[data-revealed='true'] .struck {
    animation: strike 420ms ease forwards;
  }
  .revision[data-revealed='true'] .final {
    animation: wash 520ms 260ms ease forwards;
  }
  @keyframes strike {
    to { opacity: 0; max-width: 0; margin-right: 0; }
  }
  @keyframes wash {
    from { background-size: 0% 100%; }
    to { background-size: 100% 100%; }
  }
</style>

<script>
  // Progressive enhancement: without JS, or with reduced motion, the final text
  // is simply already correct. The struck draft is only ever inserted by script.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) {
    const nodes = document.querySelectorAll<HTMLElement>('[data-revision]');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const struck = el.querySelector<HTMLElement>('.struck');
          if (struck) struck.textContent = el.dataset.from ?? '';
          el.dataset.armed = 'true';
          requestAnimationFrame(() => { el.dataset.revealed = 'true'; });
          observer.unobserve(el);
        }
      },
      { threshold: 0.6 },
    );
    for (const node of nodes) observer.observe(node);
  }
</script>
```

- [ ] **Step 2: Place it on the homepage**

In `src/pages/index.astro`, add the import:

```astro
import RevisionReveal from '../components/RevisionReveal.astro';
```

and replace the `.lede` paragraph's final sentence with:

```astro
    <p class="lede">
      Anthropy runs a research programme, publishes a student academic journal, and brings
      working academics into direct conversation with secondary students. Everything here is
      produced by students who were
      <RevisionReveal from="just interested in" to="learning to do" /> research when they started.
    </p>
```

- [ ] **Step 3: Place it on the About page**

In `src/pages/about.astro`, add the import after the existing imports:

```astro
import RevisionReveal from '../components/RevisionReveal.astro';
```

and replace the first sentence of the "What we are not" paragraph with:

```astro
  <p>
    We are <RevisionReveal from="a small think tank" to="not a think tank" />, and we do not
    claim our students' work changes fields. The point is the other direction: the students
    who learn to do this work properly now are the ones who will change those fields later.
    The journal exists so that work is taken seriously, and so the people who wrote it can
    point to it.
  </p>
```

- [ ] **Step 4: Write the failing revision test**

Create `tests/e2e/revision.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('final text is correct without the animation having run', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.lede')).toContainText('learning to do research');
  await expect(page.locator('.lede')).not.toContainText('just interested in');
});

test('the effect is contained to two placements site-wide', async ({ page }) => {
  const routes = ['/', '/journal/', '/articles/', '/events/', '/in2academia/', '/leadership/', '/about/', '/contact/'];
  let total = 0;
  for (const route of routes) {
    await page.goto(route);
    total += await page.locator('[data-revision]').count();
  }
  expect(total).toBe(2);
});

test('the draft text is inserted only when motion is allowed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  // Assert on textContent rather than toHaveText: the collapse animation ends at
  // max-width 0, giving a zero bounding box, so a visibility-aware matcher would
  // race the animation and flake.
  await expect
    .poll(async () =>
      page.locator('.lede .struck').evaluate((el) => el.textContent?.trim()),
    )
    .toBe('just interested in');
});

test('about page states what Anthropy is not', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about/');
  await expect(page.locator('.prose')).toContainText('not a think tank');
});
```

- [ ] **Step 5: Run the tests**

Run: `npm run build && npm run test:e2e`
Expected: PASS, including the earlier `no placeholder markers` tests.

- [ ] **Step 6: Create `scripts/deploy.sh`**

Static output means relocation is a copy, not a rebuild — so the deploy target is a single variable.

```bash
#!/usr/bin/env bash
# Build the site and sync it to the Synology web root.
#
# Usage:  DEPLOY_TARGET=user@synology:/volume1/web/anthropy ./scripts/deploy.sh
#
# The site is fully static: moving hosts later means changing DEPLOY_TARGET
# and repointing DNS. Nothing in the build is tied to the current host.
set -euo pipefail

if [[ -z "${DEPLOY_TARGET:-}" ]]; then
  echo "error: DEPLOY_TARGET is not set." >&2
  echo "example: DEPLOY_TARGET=user@synology:/volume1/web/anthropy $0" >&2
  exit 1
fi

echo "==> Running tests"
npm run test:unit

echo "==> Building"
npm run build

echo "==> Syncing dist/ to ${DEPLOY_TARGET}"
rsync -av --delete dist/ "${DEPLOY_TARGET}/"

echo "==> Done."
```

Make it executable:

```bash
chmod +x scripts/deploy.sh
```

- [ ] **Step 7: Create `docs/CONTENT-GUIDE.md`**

This is the deliverable that decides whether the site goes stale like the Wix one. Write it for someone who has never used git.

````markdown
# Updating the Anthropy site

You do not need to install anything or know how to code. Everything on the site
comes from text files in this repository, and you can edit them in your browser.

## The one rule

**Never put a person's name, university, or quotation on the site unless it is true
and you have their permission.** The alumni section in particular is the most
valuable thing on the site and the easiest to discredit.

## How to edit anything

1. Open the repository on GitHub.
2. Click into the file you want to change (see the map below).
3. Click the pencil icon.
4. Make your change.
5. At the bottom, write a short note about what you changed and click
   **Commit changes**.
6. Rebuild and deploy (see "Publishing your changes").

## Where things live

| To change this | Edit this |
|---|---|
| Organization name, tagline, contact email, social links | `src/data/site.json` |
| Alumni outcomes shown on the homepage | `src/data/alumni.json` |
| Journal issues | files in `src/content/journal/` |
| Articles and papers | files in `src/content/articles/` |
| Events (Humanities Focus) | files in `src/content/events/` |
| Leadership team, by year | files in `src/content/leadership/` |
| About page wording | `src/pages/about.astro` |
| In2Academia page wording | `src/pages/in2academia.astro` |

## Adding a new article

Create a new file in `src/content/articles/`, named with lowercase words and
hyphens — for example `sino-soviet-split-reconsidered.md`. Paste this in and
replace the values:

```markdown
---
title: "The Sino-Soviet Split Reconsidered"
author: "Full Name"
publishedAt: 2026-05-01
discipline: "History"
summary: "One or two sentences describing the paper."
draft: false
---

The full text of the paper goes here. Leave a blank line between paragraphs.

## Section headings look like this
```

**`draft: true` hides a file from the site.** Set it to `false` when it is ready
to publish. This is how you work on something without it appearing publicly.

## Adding a journal issue

Create a file in `src/content/journal/`:

```markdown
---
title: "Issue Two"
issueNumber: 2
publishedAt: 2026-09-01
summary: "One or two sentences describing this issue."
draft: false
---

An introduction to the issue.
```

To attach a PDF, put the file in `public/` and add `pdf: "/your-file.pdf"` to the
frontmatter.

## Adding an event

Create a file in `src/content/events/`:

```markdown
---
name: "Humanities Focus Forum"
year: 2027
format: "forum"
startsAt: 2027-11-01
summary: "One or two sentences."
upcoming: true
draft: false
---

Details about the programme, speakers, and sessions.
```

`format` is either `"week"` or `"forum"`. Set `upcoming: true` for the next event
and change it to `false` once it has happened.

## Adding a leadership year

Create a file in `src/content/leadership/` named like `2026-2027.md`:

```markdown
---
academicYear: "2026–2027"
startYear: 2026
current: true
members:
  - name: "Full Name"
    role: "Chair"
    campus: "UWC Dover"
    bio: "One or two sentences. Optional."
  - name: "Full Name"
    role: "Head of Operations"
    campus: "UWC Dover"
---
```

**Set `current: false` on the previous year's file** when you add a new one, or two
years will both claim to be current.

## Adding alumni outcomes

Edit `src/data/alumni.json`. Only add people who have agreed to be listed:

```json
{
  "outcomes": [
    { "name": "Full Name", "destination": "Georgetown University", "note": "Class of 2025" }
  ]
}
```

If the list is empty, the section simply does not appear. That is intentional and
is better than listing anyone you are unsure about.

## Publishing your changes

On the machine that hosts the site:

```bash
git pull
DEPLOY_TARGET=user@synology:/volume1/web/anthropy ./scripts/deploy.sh
```

Ask whoever set up the server for the correct `DEPLOY_TARGET` value and save it
somewhere your successors will find it.

## If something breaks

The build refuses to publish a file with missing or malformed frontmatter — this
is a feature, not a failure. Read the error: it names the file and the field.
The most common causes are a missing quotation mark around a title, or a date
written in the wrong format (it must be `YYYY-MM-DD`).
````

- [ ] **Step 8: Create `README.md`**

```markdown
# Anthropy

The website for Anthropy, a student-led humanities research organization based at
UWC South East Asia, Dover Campus.

- **Design spec:** `docs/superpowers/specs/2026-09-14-anthropy-site-design.md`
- **Editing content:** `docs/CONTENT-GUIDE.md` ← start here if you are updating the site
- **Live at:** https://anthropy.wetkarma.com

## Development

```bash
npm install
npm run dev      # local dev server
npm test         # unit tests, build, then e2e tests
```

## Deploying

```bash
DEPLOY_TARGET=user@synology:/volume1/web/anthropy ./scripts/deploy.sh
```

The site is fully static. Moving to another host means changing `DEPLOY_TARGET`
and repointing DNS — no rebuild or code change required.

## Stack

Astro (static output), TypeScript, hand-written CSS with a design-token layer.
Content lives as Markdown and JSON under `src/content/` and `src/data/`, validated
by Zod schemas at build time.
```

- [ ] **Step 9: Run the full suite**

Run: `npm test`
Expected: all unit tests pass, build succeeds, all e2e tests pass.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add contained revision effect, deploy script, and content handoff guide"
```

---

## Post-implementation checklist

These require real information from the Anthropy team and cannot be completed by an implementer:

- [ ] Replace `REPLACE_WITH_REAL_EMAIL` and both `REPLACE_WITH_REAL_URL` values in `src/data/site.json`.
- [ ] Decide the 2026 one-day event's name and set it in `src/content/events/2026-forum.md`, then set `draft: false`.
- [ ] Fill `src/content/leadership/2025-2026.md` with the real current team.
- [ ] Collect permissioned alumni outcomes and add them to `src/data/alumni.json`.
- [ ] Migrate real articles and journal issues from the Wix site into `src/content/`.
- [ ] Delete the remaining `EXAMPLE TEMPLATE` seed files once real content replaces them.
- [ ] Confirm the Synology `DEPLOY_TARGET` path and record it where successors will find it.
- [ ] Walk a successor through `docs/CONTENT-GUIDE.md` before handing over.
