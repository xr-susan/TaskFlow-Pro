/**
 * Zustand store for task management
 * Handles all state management including tasks, categories, and filters
 */

import { create } from 'zustand';
import {
  Task,
  Category,
  TaskFormData,
  TaskFilters,
  TaskStatistics,
  CATEGORY_COLORS,
} from '../types/task';

/** Generate unique ID */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/** Get current ISO timestamp */
const getTimestamp = (): string => new Date().toISOString();

/** Store state interface */
interface TaskState {
  // Data
  tasks: Task[];
  categories: Category[];
  filters: TaskFilters;
  selectedTaskIds: string[];
  darkMode: boolean;

  // Task actions
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, data: TaskFormData) => void;
  deleteTask: (id: string) => void;
  deleteTasks: (ids: string[]) => void;
  toggleTask: (id: string) => void;
  moveTasksToCategory: (taskIds: string[], categoryId: string | null) => void;
  reorderTasks: (taskId: string, newOrder: number) => void;

  // Category actions
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;

  // Filter actions
  setFilter: (filter: Partial<TaskFilters>) => void;
  resetFilters: () => void;

  // Selection actions
  selectTask: (id: string) => void;
  selectAllTasks: () => void;
  clearSelection: () => void;

  // UI actions
  toggleDarkMode: () => void;

  // Computed
  getFilteredTasks: () => Task[];
  getStatistics: () => TaskStatistics;
  getCategoryById: (id: string) => Category | undefined;
}

/** Default filter state */
const DEFAULT_FILTERS: TaskFilters = {
  search: '',
  categoryId: null,
  priority: null,
  status: 'all',
};

/** Load state from localStorage */
const loadState = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    console.warn(`Failed to load ${key} from localStorage`);
    return defaultValue;
  }
};

/** Save state to localStorage with error handling */
const saveState = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Please clear some data.');
    }
  }
};

/** Create the Zustand store */
export const useTaskStore = create<TaskState>((set, get) => ({
  // Initial state
  tasks: loadState<Task[]>('taskflow-tasks', []),
  categories: loadState<Category[]>('taskflow-categories', [
    { id: 'work', name: 'Work', color: '#3b82f6', createdAt: getTimestamp() },
    { id: 'personal', name: 'Personal', color: '#10b981', createdAt: getTimestamp() },
    { id: 'study', name: 'Study', color: '#8b5cf6', createdAt: getTimestamp() },
  ]),
  filters: DEFAULT_FILTERS,
  selectedTaskIds: [],
  darkMode: loadState<boolean>('taskflow-darkmode', false),

  // Task actions
  addTask: (data) => {
    const tasks = get().tasks;
    const newTask: Task = {
      id: generateId(),
      ...data,
      completed: false,
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
      completedAt: null,
      order: tasks.length,
    };
    const updated = [...tasks, newTask];
    saveState('taskflow-tasks', updated);
    set({ tasks: updated });
  },

  updateTask: (id, data) => {
    const updated = get().tasks.map((task) =>
      task.id === id
        ? { ...task, ...data, updatedAt: getTimestamp() }
        : task
    );
    saveState('taskflow-tasks', updated);
    set({ tasks: updated });
  },

  deleteTask: (id) => {
    const updated = get().tasks.filter((task) => task.id !== id);
    saveState('taskflow-tasks', updated);
    set({
      tasks: updated,
      selectedTaskIds: get().selectedTaskIds.filter((sid) => sid !== id),
    });
  },

  deleteTasks: (ids) => {
    const idSet = new Set(ids);
    const updated = get().tasks.filter((task) => !idSet.has(task.id));
    saveState('taskflow-tasks', updated);
    set({
      tasks: updated,
      selectedTaskIds: [],
    });
  },

  toggleTask: (id) => {
    const updated = get().tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? getTimestamp() : null,
            updatedAt: getTimestamp(),
          }
        : task
    );
    saveState('taskflow-tasks', updated);
    set({ tasks: updated });
  },

  moveTasksToCategory: (taskIds, categoryId) => {
    const idSet = new Set(taskIds);
    const updated = get().tasks.map((task) =>
      idSet.has(task.id)
        ? { ...task, categoryId, updatedAt: getTimestamp() }
        : task
    );
    saveState('taskflow-tasks', updated);
    set({ tasks: updated, selectedTaskIds: [] });
  },

  reorderTasks: (taskId, newOrder) => {
    const tasks = get().tasks;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const oldOrder = task.order;
    const updated = tasks.map((t) => {
      if (t.id === taskId) return { ...t, order: newOrder };
      if (oldOrder < newOrder && t.order > oldOrder && t.order <= newOrder) {
        return { ...t, order: t.order - 1 };
      }
      if (oldOrder > newOrder && t.order >= newOrder && t.order < oldOrder) {
        return { ...t, order: t.order + 1 };
      }
      return t;
    });
    saveState('taskflow-tasks', updated);
    set({ tasks: updated });
  },

  // Category actions
  addCategory: (name) => {
    const categories = get().categories;
    const newCategory: Category = {
      id: generateId(),
      name,
      color: CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length],
      createdAt: getTimestamp(),
    };
    const updated = [...categories, newCategory];
    saveState('taskflow-categories', updated);
    set({ categories: updated });
  },

  updateCategory: (id, name) => {
    const updated = get().categories.map((cat) =>
      cat.id === id ? { ...cat, name } : cat
    );
    saveState('taskflow-categories', updated);
    set({ categories: updated });
  },

  deleteCategory: (id) => {
    // Remove category from tasks
    const updatedTasks = get().tasks.map((task) =>
      task.categoryId === id ? { ...task, categoryId: null } : task
    );
    const updatedCategories = get().categories.filter((cat) => cat.id !== id);
    saveState('taskflow-tasks', updatedTasks);
    saveState('taskflow-categories', updatedCategories);
    set({ tasks: updatedTasks, categories: updatedCategories });
  },

  // Filter actions
  setFilter: (filter) => {
    set({ filters: { ...get().filters, ...filter } });
  },

  resetFilters: () => {
    set({ filters: DEFAULT_FILTERS });
  },

  // Selection actions
  selectTask: (id) => {
    const selected = get().selectedTaskIds;
    set({
      selectedTaskIds: selected.includes(id)
        ? selected.filter((sid) => sid !== id)
        : [...selected, id],
    });
  },

  selectAllTasks: () => {
    const filteredIds = get().getFilteredTasks().map((t) => t.id);
    set({ selectedTaskIds: filteredIds });
  },

  clearSelection: () => {
    set({ selectedTaskIds: [] });
  },

  // UI actions
  toggleDarkMode: () => {
    const newMode = !get().darkMode;
    saveState('taskflow-darkmode', newMode);
    set({ darkMode: newMode });
  },

  // Computed: get filtered tasks
  getFilteredTasks: () => {
    const { tasks, filters } = get();
    const now = new Date();

    return tasks
      .filter((task) => {
        // Search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          if (!task.title.toLowerCase().includes(searchLower)) {
            return false;
          }
        }

        // Category filter
        if (filters.categoryId && task.categoryId !== filters.categoryId) {
          return false;
        }

        // Priority filter
        if (filters.priority && task.priority !== filters.priority) {
          return false;
        }

        // Status filter
        if (filters.status !== 'all') {
          switch (filters.status) {
            case 'active':
              return !task.completed;
            case 'completed':
              return task.completed;
            case 'overdue':
              return (
                !task.completed &&
                task.dueDate !== null &&
                new Date(task.dueDate) < now
              );
          }
        }

        return true;
      })
      .sort((a, b) => a.order - b.order);
  },

  // Computed: get statistics
  getStatistics: () => {
    const { tasks, categories } = get();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const overdue = tasks.filter(
      (t) => !t.completed && t.dueDate && new Date(t.dueDate) < now
    ).length;
    const active = total - completed;

    // Priority distribution
    const priorityDistribution = {
      high: tasks.filter((t) => t.priority === 'high').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      low: tasks.filter((t) => t.priority === 'low').length,
    };

    // Category distribution
    const categoryDistribution = categories.map((cat) => ({
      categoryId: cat.id,
      categoryName: cat.name,
      count: tasks.filter((t) => t.categoryId === cat.id).length,
    }));

    // Weekly trend (last 7 days)
    const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      return {
        date: dateStr,
        completed: tasks.filter(
          (t) =>
            t.completedAt &&
            t.completedAt.split('T')[0] === dateStr
        ).length,
      };
    });

    return {
      total,
      completed,
      active,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      priorityDistribution,
      categoryDistribution,
      weeklyTrend,
    };
  },

  getCategoryById: (id) => {
    return get().categories.find((cat) => cat.id === id);
  },
}));
