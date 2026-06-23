/**
 * Task types and interfaces for TaskFlow Pro
 * Defines all data structures used across the application
 */

/** Priority levels for tasks */
export type Priority = 'high' | 'medium' | 'low';

/** Status filter options */
export type StatusFilter = 'all' | 'active' | 'completed' | 'overdue';

/** Task category/tag interface */
export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

/** Main task interface */
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  categoryId: string | null;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  order: number;
}

/** Task form data for creating/editing tasks */
export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  categoryId: string | null;
  dueDate: string | null;
}

/** Filter state for task list */
export interface TaskFilters {
  search: string;
  categoryId: string | null;
  priority: Priority | null;
  status: StatusFilter;
}

/** Statistics data for analytics page */
export interface TaskStatistics {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  completionRate: number;
  priorityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  categoryDistribution: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
  }>;
  weeklyTrend: Array<{
    date: string;
    completed: number;
  }>;
}

/** Default empty task form */
export const DEFAULT_TASK_FORM: TaskFormData = {
  title: '',
  description: '',
  priority: 'medium',
  categoryId: null,
  dueDate: null,
};

/** Default category colors */
export const CATEGORY_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // yellow
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

/** Priority display configuration */
export const PRIORITY_CONFIG = {
  high: { label: 'High', color: '#ef4444', bgColor: '#fef2f2' },
  medium: { label: 'Medium', color: '#f59e0b', bgColor: '#fffbeb' },
  low: { label: 'Low', color: '#10b981', bgColor: '#f0fdf4' },
} as const;
