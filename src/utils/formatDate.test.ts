/**
 * Tests for the date formatting utilities.
 * Dates are built from explicit local-time values so the expectations do not
 * depend on the machine's timezone.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  formatDate,
  formatDateShort,
  isOverdue,
  getRelativeTime,
  toInputDate,
  getDaysUntil,
} from './formatDate';

/** Build an ISO string that is `offsetDays` away from today, at local midnight. */
const isoFromToday = (offsetDays: number): string => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString();
};

describe('formatDate', () => {
  it('returns a placeholder for null', () => {
    expect(formatDate(null)).toBe('No date');
  });

  it('formats an ISO date as "Mon D, YYYY"', () => {
    expect(formatDate('2024-01-15T00:00:00.000Z')).toBe('Jan 15, 2024');
  });
});

describe('formatDateShort', () => {
  it('returns a dash for null', () => {
    expect(formatDateShort(null)).toBe('-');
  });

  it('formats without the year', () => {
    expect(formatDateShort('2024-01-15T00:00:00.000Z')).toBe('1/15');
  });
});

describe('isOverdue', () => {
  it('is false when there is no due date', () => {
    expect(isOverdue(null)).toBe(false);
  });

  it('is true for a past date', () => {
    expect(isOverdue(isoFromToday(-2))).toBe(true);
  });

  it('is false for a future date', () => {
    expect(isOverdue(isoFromToday(2))).toBe(false);
  });
});

describe('getRelativeTime', () => {
  it('returns an empty string for null', () => {
    expect(getRelativeTime(null)).toBe('');
  });

  it('describes future dates', () => {
    expect(getRelativeTime(isoFromToday(3))).toBe('In 3 days');
  });

  it('describes past dates', () => {
    expect(getRelativeTime(isoFromToday(-3))).toBe('3 days ago');
  });
});

describe('toInputDate', () => {
  it('returns an empty string for null', () => {
    expect(toInputDate(null)).toBe('');
  });

  it('keeps only the date part', () => {
    expect(toInputDate('2024-03-09T18:30:00.000Z')).toBe('2024-03-09');
  });
});

describe('getDaysUntil', () => {
  it('returns null when there is no due date', () => {
    expect(getDaysUntil(null)).toBeNull();
  });

  it('returns 0 for today', () => {
    expect(getDaysUntil(isoFromToday(0))).toBe(0);
  });

  it('returns a positive count for future dates', () => {
    expect(getDaysUntil(isoFromToday(5))).toBe(5);
  });

  it('returns a negative count for past dates', () => {
    expect(getDaysUntil(isoFromToday(-4))).toBe(-4);
  });

  it('ignores the time of day', () => {
    // Same calendar day but a different clock time must still be 0.
    const now = new Date();
    const later = new Date(now.getTime() + 60 * 60 * 1000);
    expect(getDaysUntil(later.toISOString())).toBe(0);
  });
});

describe('timezone independence', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('formatDate is stable when the clock is frozen', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-01T10:00:00.000Z'));
    expect(formatDate('2024-06-01T10:00:00.000Z')).toBe('Jun 1, 2024');
  });
});
