import { describe, it, expect } from 'vitest';
import { formatIssueDate, formatEventDate } from '../../src/lib/format';

describe('formatIssueDate', () => {
  it('formats a date as "Month YYYY"', () => {
    expect(formatIssueDate(new Date('2026-03-15T00:00:00Z'))).toBe('March 2026');
  });

  it('is stable across timezones for first-of-month dates', () => {
    expect(formatIssueDate(new Date('2026-01-01T00:00:00Z'))).toBe('January 2026');
  });
});

describe('formatEventDate', () => {
  it('formats as "D Month YYYY" in UTC', () => {
    expect(formatEventDate(new Date('2026-11-14T00:00:00Z'))).toBe('14 November 2026');
  });
});
