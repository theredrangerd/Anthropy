# Anthropy

The website for Anthropy, a student-led humanities research organization based at
UWC South East Asia, Dover Campus.

- **Design spec:** `docs/superpowers/specs/2026-09-14-anthropy-site-design.md`
- **Editing content:** `docs/CONTENT-GUIDE.md` ← start here if you are updating the site
- **Host:** https://anthropy.wetkarma.com

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
