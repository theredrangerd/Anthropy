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
| Timeline of key events (Home, About, footer) | `src/data/timeline.json` |
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
name: "Name of the event"
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

**Before you un-draft `src/content/events/2026-forum.md`**, replace its `name:` field
with the confirmed event name. It currently holds a `PENDING —` placeholder because
the 2026 one-day forum has not been named yet. Setting `draft: false` without fixing
the name publishes that placeholder text to a live page.

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
    { "name": "Full Name", "destination": "University name", "note": "Class of YYYY" }
  ]
}
```

If the list is empty, the section simply does not appear. That is intentional and
is better than listing anyone you are unsure about.

## Adding a timeline event

Edit `src/data/timeline.json`. Each entry needs a `year` (used for sorting),
a `dateLabel` (what's actually displayed — can be a year, a year range, or a
specific month), a `title`, and a `description`:

```json
{ "year": 2026, "dateLabel": "June 2026", "title": "A short headline", "description": "One or two sentences of context." }
```

Events render oldest to newest. The homepage and footer only show the most
recent few; the About page shows all of them.

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
