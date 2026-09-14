import { describe, it, expect } from 'vitest';
import { sortByDateDesc, sortByDateAsc, excludeDrafts } from '../../src/lib/collections';

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

describe('sortByDateAsc', () => {
  it('orders oldest first', () => {
    const items = [
      { id: 'old', when: new Date('2024-01-01') },
      { id: 'new', when: new Date('2026-01-01') },
      { id: 'mid', when: new Date('2025-01-01') },
    ];
    expect(sortByDateAsc(items, (i) => i.when).map((i) => i.id))
      .toEqual(['old', 'mid', 'new']);
  });

  it('does not mutate the input array', () => {
    const items = [
      { id: 'a', when: new Date('2026-01-01') },
      { id: 'b', when: new Date('2024-01-01') },
    ];
    sortByDateAsc(items, (i) => i.when);
    expect(items.map((i) => i.id)).toEqual(['a', 'b']);
  });

  it('returns an empty array unchanged', () => {
    expect(sortByDateAsc([], (i: { when: Date }) => i.when)).toEqual([]);
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
