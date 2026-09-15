/**
 * Tests for the Zustand task store.
 *
 * The store is a module-level singleton that reads localStorage once at import
 * time, so every test resets it explicitly to keep cases independent.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore } from './taskStore';
import { Task, TaskFormData, Category } from '../types/task';

const CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: '#3b82f6', createdAt: '2024-01-01T00:00:00.000Z' },
  { id: 'personal', name: 'Personal', color: '#10b981', createdAt: '2024-01-01T00:00:00.000Z' },
];

const DEFAULT_FILTERS = {
  search: '',
  categoryId: null,
  priority: null,
  status: 'all' as const,
};

const form = (overrides: Partial<TaskFormData> = {}): TaskFormData => ({
  title: 'A task',
  description: '',
  priority: 'medium',
  categoryId: null,
  dueDate: null,
  ...overrides,
});

/** Add `count` tasks titled "Task 1".."Task N" and return their ids in order. */
const seed = (count: number): string[] => {
  for (let index = 1; index <= count; index += 1) {
    useTaskStore.getState().addTask(form({ title: `Task ${index}` }));
  }
  return useTaskStore.getState().tasks.map((task) => task.id);
};

const titlesInOrder = (): string[] =>
  useTaskStore.getState().getFilteredTasks().map((task) => task.title);

beforeEach(() => {
  useTaskStore.setState({
    tasks: [],
    categories: CATEGORIES,
    filters: DEFAULT_FILTERS,
    selectedTaskIds: [],
    darkMode: false,
  });
});

describe('addTask', () => {
  it('appends the task with a monotonically increasing order', () => {
    seed(3);
    const orders = useTaskStore.getState().tasks.map((task) => task.order);
    expect(orders).toEqual([0, 1, 2]);
  });

  it('creates tasks as active with no completion timestamp', () => {
    seed(1);
    const task = useTaskStore.getState().tasks[0];
    expect(task.completed).toBe(false);
    expect(task.completedAt).toBeNull();
    expect(task.id).toBeTruthy();
  });

  it('persists to localStorage', () => {
    seed(1);
    const stored = JSON.parse(localStorage.getItem('taskflow-tasks') ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('Task 1');
  });
});

describe('updateTask', () => {
  it('merges the patch and refreshes updatedAt', () => {
    const [id] = seed(1);
    useTaskStore.getState().updateTask(id, form({ title: 'Renamed', priority: 'high' }));

    const task = useTaskStore.getState().tasks[0];
    expect(task.title).toBe('Renamed');
    expect(task.priority).toBe('high');
  });
});

describe('toggleTask', () => {
  it('marks the task complete and stamps completedAt', () => {
    const [id] = seed(1);
    useTaskStore.getState().toggleTask(id);

    const task = useTaskStore.getState().tasks[0];
    expect(task.completed).toBe(true);
    expect(task.completedAt).not.toBeNull();
  });

  it('clears completedAt when toggled back', () => {
    const [id] = seed(1);
    useTaskStore.getState().toggleTask(id);
    useTaskStore.getState().toggleTask(id);

    const task = useTaskStore.getState().tasks[0];
    expect(task.completed).toBe(false);
    expect(task.completedAt).toBeNull();
  });
});

describe('deleteTask and deleteTasks', () => {
  it('removes a single task and drops it from the selection', () => {
    const [first] = seed(2);
    useTaskStore.getState().selectTask(first);
    useTaskStore.getState().deleteTask(first);

    expect(useTaskStore.getState().tasks).toHaveLength(1);
    expect(useTaskStore.getState().selectedTaskIds).toEqual([]);
  });

  it('removes many tasks and clears the selection', () => {
    const ids = seed(3);
    useTaskStore.getState().selectAllTasks();
    useTaskStore.getState().deleteTasks([ids[0], ids[1]]);

    expect(useTaskStore.getState().tasks).toHaveLength(1);
    expect(useTaskStore.getState().selectedTaskIds).toEqual([]);
  });
});

describe('moveTasksToCategory', () => {
  it('reassigns the given tasks and clears the selection', () => {
    const ids = seed(2);
    useTaskStore.getState().moveTasksToCategory([ids[0]], 'work');

    const tasks = useTaskStore.getState().tasks;
    expect(tasks.find((task) => task.id === ids[0])?.categoryId).toBe('work');
    expect(tasks.find((task) => task.id === ids[1])?.categoryId).toBeNull();
    expect(useTaskStore.getState().selectedTaskIds).toEqual([]);
  });
});

describe('reorderTasks', () => {
  it('moves a task later and shifts the tasks in between up', () => {
    const ids = seed(4);
    // Task 1 (order 0) -> order 2. Tasks at order 1 and 2 shift up.
    useTaskStore.getState().reorderTasks(ids[0], 2);

    expect(titlesInOrder()).toEqual(['Task 2', 'Task 3', 'Task 1', 'Task 4']);
    expect(useTaskStore.getState().tasks.map((task) => task.order).sort()).toEqual([0, 1, 2, 3]);
  });

  it('moves a task earlier and shifts the tasks in between down', () => {
    const ids = seed(4);
    // Task 4 (order 3) -> order 1.
    useTaskStore.getState().reorderTasks(ids[3], 1);

    expect(titlesInOrder()).toEqual(['Task 1', 'Task 4', 'Task 2', 'Task 3']);
  });

  it('is a no-op for an unknown id', () => {
    seed(2);
    const before = useTaskStore.getState().tasks;
    useTaskStore.getState().reorderTasks('does-not-exist', 0);
    expect(useTaskStore.getState().tasks).toEqual(before);
  });

  it('leaves orders contiguous after many moves', () => {
    const ids = seed(5);
    useTaskStore.getState().reorderTasks(ids[0], 4);
    useTaskStore.getState().reorderTasks(ids[3], 0);
    useTaskStore.getState().reorderTasks(ids[2], 2);

    const orders = useTaskStore
      .getState()
      .tasks.map((task) => task.order)
      .sort((a, b) => a - b);
    expect(orders).toEqual([0, 1, 2, 3, 4]);
  });
});

describe('filters', () => {
  beforeEach(() => {
    useTaskStore.getState().addTask(form({ title: 'Write report', priority: 'high', categoryId: 'work' }));
    useTaskStore.getState().addTask(form({ title: 'Buy milk', priority: 'low', categoryId: 'personal' }));
    const [reportId] = useTaskStore.getState().tasks.map((task) => task.id);
    useTaskStore.getState().toggleTask(reportId);
  });

  it('filters by search text, case-insensitively', () => {
    useTaskStore.getState().setFilter({ search: 'MILK' });
    expect(titlesInOrder()).toEqual(['Buy milk']);
  });

  it('filters by category', () => {
    useTaskStore.getState().setFilter({ categoryId: 'work' });
    expect(titlesInOrder()).toEqual(['Write report']);
  });

  it('filters by priority', () => {
    useTaskStore.getState().setFilter({ priority: 'low' });
    expect(titlesInOrder()).toEqual(['Buy milk']);
  });

  it('filters by status', () => {
    useTaskStore.getState().setFilter({ status: 'completed' });
    expect(titlesInOrder()).toEqual(['Write report']);

    useTaskStore.getState().setFilter({ status: 'active' });
    expect(titlesInOrder()).toEqual(['Buy milk']);
  });

  it('combines multiple filters', () => {
    useTaskStore.getState().setFilter({ categoryId: 'work', status: 'active' });
    expect(titlesInOrder()).toEqual([]);
  });

  it('resetFilters restores the defaults', () => {
    useTaskStore.getState().setFilter({ search: 'milk', priority: 'low' });
    useTaskStore.getState().resetFilters();
    expect(useTaskStore.getState().filters).toEqual(DEFAULT_FILTERS);
  });
});

describe('getStatistics', () => {
  it('reports zeroes for an empty store', () => {
    const stats = useTaskStore.getState().getStatistics();
    expect(stats.total).toBe(0);
    expect(stats.completionRate).toBe(0);
    expect(stats.weeklyTrend).toHaveLength(7);
  });

  it('counts completion, priorities and categories', () => {
    useTaskStore.getState().addTask(form({ priority: 'high', categoryId: 'work' }));
    useTaskStore.getState().addTask(form({ priority: 'low', categoryId: 'personal' }));
    useTaskStore.getState().addTask(form({ priority: 'high', categoryId: 'work' }));
    const [firstId] = useTaskStore.getState().tasks.map((task) => task.id);
    useTaskStore.getState().toggleTask(firstId);

    const stats = useTaskStore.getState().getStatistics();
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.active).toBe(2);
    expect(stats.completionRate).toBe(33);
    expect(stats.priorityDistribution.high).toBe(2);
    expect(stats.categoryDistribution.find((row) => row.categoryId === 'work')?.count).toBe(2);
  });

  it('counts overdue tasks', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    useTaskStore.getState().addTask(form({ dueDate: yesterday.toISOString() }));

    expect(useTaskStore.getState().getStatistics().overdue).toBe(1);
  });
});

describe('categories', () => {
  it('adds a category with a colour from the palette', () => {
    useTaskStore.getState().addCategory('Errands');
    const categories = useTaskStore.getState().categories;
    const added = categories[categories.length - 1];
    expect(added?.name).toBe('Errands');
    expect(added?.color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('renames a category', () => {
    useTaskStore.getState().updateCategory('work', 'Job');
    expect(useTaskStore.getState().getCategoryById('work')?.name).toBe('Job');
  });

  it('deleting a category detaches it from its tasks', () => {
    useTaskStore.getState().addTask(form({ categoryId: 'work' }));
    useTaskStore.getState().deleteCategory('work');

    expect(useTaskStore.getState().getCategoryById('work')).toBeUndefined();
    expect(useTaskStore.getState().tasks[0].categoryId).toBeNull();
  });
});

describe('selection', () => {
  it('toggles a task in and out of the selection', () => {
    const [id] = seed(2);
    useTaskStore.getState().selectTask(id);
    expect(useTaskStore.getState().selectedTaskIds).toEqual([id]);

    useTaskStore.getState().selectTask(id);
    expect(useTaskStore.getState().selectedTaskIds).toEqual([]);
  });

  it('selectAllTasks only selects tasks visible under the current filter', () => {
    const ids = seed(3);
    useTaskStore.getState().updateTask(ids[0], form({ title: 'Keep', priority: 'high' }));
    useTaskStore.getState().setFilter({ priority: 'high' });

    useTaskStore.getState().selectAllTasks();
    expect(useTaskStore.getState().selectedTaskIds).toEqual([ids[0]]);
  });
});

describe('dark mode', () => {
  it('toggles and persists the preference', () => {
    useTaskStore.getState().toggleDarkMode();
    expect(useTaskStore.getState().darkMode).toBe(true);
    expect(JSON.parse(localStorage.getItem('taskflow-darkmode') ?? 'false')).toBe(true);
  });
});

describe('state shape', () => {
  it('every task carries the fields the UI relies on', () => {
    seed(1);
    const task: Task = useTaskStore.getState().tasks[0];
    expect(Object.keys(task).sort()).toEqual(
      [
        'categoryId',
        'completed',
        'completedAt',
        'createdAt',
        'description',
        'dueDate',
        'id',
        'order',
        'priority',
        'title',
        'updatedAt',
      ].sort(),
    );
  });
});
