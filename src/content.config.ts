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
        /** Display weight for the current-year bento grid: 'lead' (largest
         *  tiles, e.g. co-chairs), 'core' (medium, e.g. team heads), or
         *  'mentor' (smaller, uniform tiles). Unused for past years, which
         *  render as a plain grid regardless of tier. */
        tier: z.enum(['lead', 'core', 'mentor']).default('core'),
        campus: z.string().default('UWC Dover'),
        bio: z.string().optional(),
        photo: z.string().optional(),
      }),
    ).default([]),
  }),
});

export const collections = { journal, articles, events, leadership };
