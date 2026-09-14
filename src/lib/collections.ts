/** Returns a new array ordered newest-first by the extracted date. */
export function sortByDateDesc<T>(items: T[], key: (item: T) => Date): T[] {
  return [...items].sort((a, b) => key(b).getTime() - key(a).getTime());
}

/** Drops entries whose frontmatter marks them as a draft. */
export function excludeDrafts<T extends { data: { draft?: boolean } }>(items: T[]): T[] {
  return items.filter((item) => !item.data.draft);
}
