# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static output), TypeScript, hand-written CSS with a design-token layer (`src/styles/tokens.css`, `global.css`). Content is Markdown/JSON under `src/content/` and `src/data/`, validated by Zod at build time. Deployed to GitHub Pages under base path `/Anthropy/`; production host is `anthropy.wetkarma.com`.

## Users

1. Outside legitimacy readers (highest priority): prospective Humanities Focus Week speakers (academics, researchers) and college admissions readers deciding whether Anthropy is serious.
2. Prospective In2Academia writers: high schoolers deciding whether to join.
3. Teachers and school stakeholders who need reassurance the organization is serious.

Where audiences conflict, the higher one wins.

## Product Purpose

Anthropy is a student-run humanities research organization at UWC South East Asia, Dover Campus (founded 2021). It does not aim to produce world-changing research; it incubates the people who will. The site makes that pipeline legible and credible to outsiders so it keeps working. Credibility is what gets a speaker to say yes, gets a student's paper taken seriously off-campus, and gets In2Academia read as a real credential. The site is a credibility instrument for other people's work, not a portfolio for its builders.

Homepage success test: a speaker or admissions reader lands and thinks "these people know what they're doing."

## Positioning

A student-led humanities research body that publishes real student work (an annual academic journal plus individual articles) and runs a research-training program and a speaker program. Honest about scale: a Dover-based organization with a few UWC East members and outside contributors, not a federated multi-campus institution.

## Operating Context

- In2Academia (I2A): jumpstart program teaching high schoolers humanities research, ending in published papers.
- Humanities Focus Week (HFW): speaker program, changing this year from a week-long series to a single-day forum.
- The Anthropy Review (academic journal): three issues so far (2024, 2025, 2026), published as PDFs.
- Articles: 16 individual student pieces.
- Leadership changes yearly; the current team plus past years are shown.
- Content is added by editing files in git, not by touching templates (`docs/CONTENT-GUIDE.md`).

## Capabilities and Constraints

- Pages: Home, About, Journal, Articles, In2Academia, Events, Leadership, Contact, 404.
- The one-day forum has no confirmed name; it must stay a content field, never hard-coded in templates or nav.
- Content is thin (this-year-forward). Every collection must look intentional at n=1 and still work at n=30 without a redesign.
- Static output, minimal JS. All internal links and assets must respect the `/Anthropy/` base path.
- LinkedIn URL in `src/data/site.json` is still a placeholder (`REPLACE_WITH_REAL_URL`).
- Several leadership bios are placeholders ("A fuller bio is on its way").

## Brand Commitments

- Standalone identity, not a UWC sub-brand.
- Tagline in use: "Fostering early intellectual curiosity and meaningful engagement within the humanities."
- A "live editing" effect (a paper being drafted or revised) is kept, but limited to a few deliberate moments, never site-wide, and it must respect `prefers-reduced-motion` and never delay or obscure content.
- Standing visual preference (chosen by the user after two direction rounds): the category standard, a serious university-press journal register, executed at full craft with no irony or smuggled quirk. Craft bar: Harvard Undergraduate Research Journal and Oxford Academic. The user rejected informal directions (risograph zine, quilt) as "too informal" and liked 1940s Penguin/Pelican banded covers.
- The earlier spec named editorial/collage register with navy/sage/cream cues from an existing poster as directional only, explicitly not locked.

## Evidence on Hand

- Three journal PDFs in `public/journal/`; 16 articles in `src/content/articles/`; event records for 2025 HFW and the 2026 forum.
- Alumni data in `src/data/alumni.json` and a timeline in `src/data/timeline.json`; alumni outcomes require verified names and outcomes before being presented as proof.
- Leadership photos for two mentors; other members have no photos.
- Source material and event photos in `resources/` (not published).
- Absent: verified testimonials, speaker endorsements, metrics. Do not fabricate.

## Product Principles

1. Proof before invitation: lead with real work, alumni outcomes and program record.
2. Credibility over polish theater: never oversell scale or institutional weight.
3. Curated, never sparse: thin content is presented as deliberate selection.
4. The work is the hero: student writing and journals are shown as the artifacts they are.
5. Content-as-files: design must accommodate new issues, articles and years without template edits.

## Accessibility & Inclusion

Respect `prefers-reduced-motion`. Readable long-form article text. No further product-specific standard was stated.
