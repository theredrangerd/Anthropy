# Anthropy Site — Design Spec

**Date:** 2026-09-14
**Status:** Approved, ready for implementation planning
**Context doc:** https://claude.ai/code/artifact/b99a9d51-21ca-4f4b-b094-3e1d27277cb8

## 1. What Anthropy is

A student-run humanities research organization based at **UWC Dover**. Leadership is
entirely Dover-based; there are a few members from UWC East (also part of UWC SEA) and
one contributing writer from China. It is a Dover organization with outside
contributors — **not** a federated multi-campus institution, despite the old Wix site's
"multiple campuses" language.

It runs two programs:

- **In2Academia (I2A)** — a jumpstart program teaching high schoolers how to do
  humanities research, culminating in published papers.
- **Humanities Focus Week (HFW)** — a speaker program bringing in academics and
  researchers. **Changing this year** from a week-long series to a single-day forum.
  Final name pending.

It also publishes an **Academic Journal** of student work.

## 2. Mission of the site

Anthropy does not produce world-changing research; it **incubates the people who will**.
The site's job is to make that pipeline *legible and credible to outsiders* so the
pipeline keeps working.

Legitimacy is the mechanism, not the goal. Credibility is what gets a speaker to say
yes, gets a student's paper taken seriously off-campus, and gets I2A read as a real
credential rather than a club activity.

**The site is a credibility instrument for other people's work, not a portfolio piece
for its builders.**

Success test for the homepage: a speaker or admissions reader lands on it and thinks
*"these people know what they're doing."*

## 3. Audience priority

Ordered. Where they conflict, higher wins.

1. **Outside legitimacy** — prospective HFW speakers, college admissions readers.
   The homepage leads with **proof, not invitation**.
2. **Prospective I2A writers** — students deciding whether to join.
3. **Teachers / school stakeholders** — reassurance the org is serious.

## 4. Decisions locked

| Decision | Choice |
|---|---|
| Homepage lead | Outside legitimacy first — proof over invitation |
| Scope framing | UWC Dover-based, open to outside contributors |
| Brand | Standalone identity; not a UWC sub-brand |
| Aesthetic anchor | Directional only — editorial/collage register, navy/sage/cream cues from existing poster. **Not locked**; more posters in other styles are coming |
| Content depth | Thin (this-year-forward). Design curated/featured, never sparse archive grids |
| "Live editing" effect | Kept, but contained to a few deliberate moments — not site-wide |
| Content model | Markdown/JSON in git; adding an issue = adding a file |
| Stack | Astro (static output, minimal JS, islands for interactivity) |
| Host | Synology NAS at `anthropy.wetkarma.com` |

### Known open item

**The new one-day HFW format has no confirmed name.** "Humanities Focus Forum Day" was
floated. Events page content and nav labels must not hard-code a name until this lands —
build it as a content field, not a string in a template.

## 5. Pages

| Page | Job |
|---|---|
| **Home** | Establish credibility in one screen. Lead with proof: alumni outcomes, journal, program record. |
| **About** | What Anthropy is, its presence at UWC Dover, the mission, the two programs. |
| **Journal** | Current + past journal issues. Curated presentation. |
| **Articles** | Individual student papers/articles, as on the current Wix site. |
| **In2Academia** | The program: what it is, what you get, how to join. Primary conversion page for student audience. |
| **Events / HFW** | Multi-year HFW history + the new one-day forum. Must hold both without reading as inconsistent. |
| **Leadership** | Current team, with tabbed/switchable access to previous years (2021–present). |
| **Contact** | How to reach the org. Speaker inquiries are a first-class path, not a generic form. |
| *(global)* | Social links (LinkedIn, Instagram) in footer. |

Existing mission copy worth preserving or deliberately evolving:
> "Fostering early intellectual curiosity and meaningful engagement within the humanities."

## 6. Shortcomings of the Wix site to fix

Named in the brainstorm: bad formatting, inconsistent updates, hard to navigate,
aesthetically unappealing. The *inconsistent updates* problem is structural, not
cosmetic — see §8.

## 7. Design direction

- **Register:** editorial, institutional, confident. Think small research institution —
  but honest about scale. Do not borrow so much institutional weight that a skeptical
  visitor who clicks through feels oversold.
- **Palette:** navy as ink (text, rules, structure) rather than large fields; a working
  accent; restrained highlight. Directional, not locked.
- **Typography:** carries the personality. A characterful display face used with
  restraint; a readable body face suited to long-form article text.
- **Proof section:** alumni outcomes ("our alumni are at Georgetown, Princeton…") is the
  single strongest legitimacy signal. It gets real estate, not a buried testimonial.
  **Requires real, verified names/outcomes before launch** — see §9.
- **Sparse-proof layouts:** every content collection must look intentional at n=1 and
  still work at n=30, without a redesign.

### The contained "live-editing" moment

A deliberate effect evoking a paper being drafted/revised — used in **a few chosen
places**, not as ambient site-wide behavior. Rationale: a page that visibly rewrites
itself everywhere reads as *unstable*, which undercuts "these people know what they're
doing." Contained, it reads as craft.

Must respect `prefers-reduced-motion` and never delay or obscure real content.

## 8. Content model

Content lives in the repo as Markdown/JSON, not in templates. Adding a journal issue,
article, event, or leadership year means **adding or editing a file** — no component
edits.

This is the direct fix for the Wix site going stale. It requires a **handoff document**
explaining how a non-technical successor edits content through GitHub's web UI. That
document is a deliverable, not an optional extra.

## 9. Risks

1. **Thin content.** The site's ambition exceeds its current material. Mitigation:
   curated/featured layouts that are honest at low volume.
2. **Alumni claims must be true.** Named outcomes are the strongest signal and the
   biggest liability if unverified. Collect real permission and real facts, or cut the
   section. Do not fabricate or approximate placeholder names that could ship.
3. **Personal-infrastructure dependency.** `anthropy.wetkarma.com` on a personal NAS
   means the org's web presence depends on one person's hardware and domain. Acceptable
   for v1; mitigate by keeping output fully static and portable so relocation is a DNS
   change plus a file copy.
4. **Succession.** Without the §8 handoff doc actually being written and handed over,
   this site becomes the next stale Wix.

## 10. Out of scope for v1

- Per-campus chapter content or a federated structure.
- Any CMS, database, login, or server-side runtime.
- Paper submission/review workflow tooling.
