/**
 * Date formatting utility functions
 * Provides consistent date formatting across the application
 */

/**
 * Format date to readable string
 * @param dateStr - ISO date string
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'No date';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format date to short string
 * @param dateStr - ISO date string
 * @returns Short date string (e.g., "1/15")
 */
export function formatDateShort(dateStr: string | null): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
  });
}

/**
 * Check if a date is overdue
 * @param dateStr - ISO date string
 * @returns true if date is in the past
 */
export function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

/**
 * Get relative time string (e.g., "2 days ago", "in 3 days")
 * @param dateStr - ISO date string
 * @returns Relative time string
 */
export function getRelativeTime(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

/**
 * Format date for input[type="date"]
 * @param dateStr - ISO date string
 * @returns Date string in YYYY-MM-DD format
 */
export function toInputDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
}

/**
 * Get days until due date
 * @param dateStr - ISO date string
 * @returns Number of days (negative if overdue)
 */
export function getDaysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
