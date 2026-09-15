/**
 * Tests for TaskList, focused on the drag-and-drop and keyboard reordering
 * behaviour that the README advertises.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from './TaskList';
import { useTaskStore } from '../../stores/taskStore';
import { TaskFormData, Category } from '../../types/task';

const CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: '#3b82f6', createdAt: '2024-01-01T00:00:00.000Z' },
];

const form = (title: string): TaskFormData => ({
  title,
  description: '',
  priority: 'medium',
  categoryId: null,
  dueDate: null,
});

/** Minimal DataTransfer stand-in; jsdom does not implement the real one. */
const createDataTransfer = () => ({
  data: {} as Record<string, string>,
  effectAllowed: 'none',
  dropEffect: 'none',
  setData(format: string, value: string) {
    this.data[format] = value;
  },
  getData(format: string) {
    return this.data[format] ?? '';
  },
});

const seed = (titles: string[]) => {
  titles.forEach((title) => useTaskStore.getState().addTask(form(title)));
};

const renderedTitles = (): string[] =>
  screen.getAllByRole('heading', { level: 3 }).map((node) => node.textContent ?? '');

beforeEach(() => {
  useTaskStore.setState({
    tasks: [],
    categories: CATEGORIES,
    filters: { search: '', categoryId: null, priority: null, status: 'all' },
    selectedTaskIds: [],
    darkMode: false,
  });
});

describe('rendering', () => {
  it('lists every task in order', () => {
    seed(['Alpha', 'Beta', 'Gamma']);
    render(<TaskList />);
    expect(renderedTitles()).toEqual(['Alpha', 'Beta', 'Gamma']);
  });

  it('shows the task count', () => {
    seed(['Alpha', 'Beta']);
    render(<TaskList />);
    expect(screen.getByText(/2 tasks/)).toBeInTheDocument();
  });

  it('shows the empty state when there are no tasks', () => {
    render(<TaskList />);
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
  });

  it('shows a filter-aware empty state', () => {
    seed(['Alpha']);
    useTaskStore.getState().setFilter({ search: 'nothing-matches' });
    render(<TaskList />);
    expect(screen.getByText('No matching tasks')).toBeInTheDocument();
  });

  it('gives every task a reorder handle', () => {
    seed(['Alpha', 'Beta']);
    render(<TaskList />);
    expect(screen.getByLabelText('Reorder Alpha')).toBeInTheDocument();
    expect(screen.getByLabelText('Reorder Beta')).toBeInTheDocument();
  });
});

describe('keyboard reordering', () => {
  it('ArrowDown swaps the task with the next one', () => {
    seed(['Alpha', 'Beta', 'Gamma']);
    render(<TaskList />);

    fireEvent.keyDown(screen.getByLabelText('Reorder Alpha'), { key: 'ArrowDown' });

    expect(renderedTitles()).toEqual(['Beta', 'Alpha', 'Gamma']);
  });

  it('ArrowUp swaps the task with the previous one', () => {
    seed(['Alpha', 'Beta', 'Gamma']);
    render(<TaskList />);

    fireEvent.keyDown(screen.getByLabelText('Reorder Gamma'), { key: 'ArrowUp' });

    expect(renderedTitles()).toEqual(['Alpha', 'Gamma', 'Beta']);
  });

  it('ArrowUp on the first task does nothing', () => {
    seed(['Alpha', 'Beta']);
    render(<TaskList />);

    fireEvent.keyDown(screen.getByLabelText('Reorder Alpha'), { key: 'ArrowUp' });

    expect(renderedTitles()).toEqual(['Alpha', 'Beta']);
  });

  it('ArrowDown on the last task does nothing', () => {
    seed(['Alpha', 'Beta']);
    render(<TaskList />);

    fireEvent.keyDown(screen.getByLabelText('Reorder Beta'), { key: 'ArrowDown' });

    expect(renderedTitles()).toEqual(['Alpha', 'Beta']);
  });

  it('ignores unrelated keys', () => {
    seed(['Alpha', 'Beta']);
    render(<TaskList />);

    fireEvent.keyDown(screen.getByLabelText('Reorder Alpha'), { key: 'Enter' });

    expect(renderedTitles()).toEqual(['Alpha', 'Beta']);
  });
});

describe('drag and drop reordering', () => {
  it('dropping a task onto a later task moves it there', () => {
    seed(['Alpha', 'Beta', 'Gamma']);
    render(<TaskList />);

    const dataTransfer = createDataTransfer();
    fireEvent.dragStart(screen.getByLabelText('Reorder Alpha'), { dataTransfer });
    fireEvent.dragOver(screen.getByLabelText('Reorder Gamma'), { dataTransfer });
    fireEvent.drop(screen.getByLabelText('Reorder Gamma'), { dataTransfer });

    expect(renderedTitles()).toEqual(['Beta', 'Gamma', 'Alpha']);
  });

  it('dropping a task onto an earlier task moves it there', () => {
    seed(['Alpha', 'Beta', 'Gamma']);
    render(<TaskList />);

    const dataTransfer = createDataTransfer();
    fireEvent.dragStart(screen.getByLabelText('Reorder Gamma'), { dataTransfer });
    fireEvent.dragOver(screen.getByLabelText('Reorder Alpha'), { dataTransfer });
    fireEvent.drop(screen.getByLabelText('Reorder Alpha'), { dataTransfer });

    expect(renderedTitles()).toEqual(['Gamma', 'Alpha', 'Beta']);
  });

  it('marks the dragged card and the drop target', () => {
    seed(['Alpha', 'Beta']);
    render(<TaskList />);

    const dataTransfer = createDataTransfer();
    const alphaCard = screen
      .getByLabelText('Reorder Alpha')
      .closest('div[class*="surface"]') as HTMLElement;
    const betaCard = screen
      .getByLabelText('Reorder Beta')
      .closest('div[class*="surface"]') as HTMLElement;

    expect(alphaCard).not.toBeNull();
    expect(betaCard).not.toBeNull();

    fireEvent.dragStart(screen.getByLabelText('Reorder Alpha'), { dataTransfer });
    expect(alphaCard).toHaveAttribute('data-dragging', 'true');

    fireEvent.dragOver(screen.getByLabelText('Reorder Beta'), { dataTransfer });
    expect(betaCard).toHaveAttribute('data-drop-target', 'true');
  });

  it('clears the drag state after the drop', () => {
    seed(['Alpha', 'Beta']);
    render(<TaskList />);

    const dataTransfer = createDataTransfer();
    fireEvent.dragStart(screen.getByLabelText('Reorder Alpha'), { dataTransfer });
    fireEvent.drop(screen.getByLabelText('Reorder Beta'), { dataTransfer });

    expect(document.querySelector('[data-dragging]')).toBeNull();
    expect(document.querySelector('[data-drop-target]')).toBeNull();
  });

  it('dropping a task onto itself changes nothing', () => {
    seed(['Alpha', 'Beta']);
    render(<TaskList />);

    const dataTransfer = createDataTransfer();
    fireEvent.dragStart(screen.getByLabelText('Reorder Alpha'), { dataTransfer });
    fireEvent.drop(screen.getByLabelText('Reorder Alpha'), { dataTransfer });

    expect(renderedTitles()).toEqual(['Alpha', 'Beta']);
  });

  it('keeps the order contiguous in the store after a drag', () => {
    seed(['Alpha', 'Beta', 'Gamma', 'Delta']);
    render(<TaskList />);

    const dataTransfer = createDataTransfer();
    fireEvent.dragStart(screen.getByLabelText('Reorder Delta'), { dataTransfer });
    fireEvent.drop(screen.getByLabelText('Reorder Beta'), { dataTransfer });

    const orders = useTaskStore
      .getState()
      .tasks.map((task) => task.order)
      .sort((a, b) => a - b);
    expect(orders).toEqual([0, 1, 2, 3]);
    expect(renderedTitles()).toEqual(['Alpha', 'Delta', 'Beta', 'Gamma']);
  });

  it('reorders correctly while a filter hides some tasks', () => {
    seed(['Alpha', 'Beta', 'Gamma']);
    const [alphaId] = useTaskStore.getState().tasks.map((task) => task.id);
    // Give Alpha a different priority so a priority filter can hide it.
    useTaskStore.getState().updateTask(alphaId, { ...form('Alpha'), priority: 'high' });
    useTaskStore.getState().setFilter({ priority: 'medium' });
    render(<TaskList />);

    expect(renderedTitles()).toEqual(['Beta', 'Gamma']);

    const dataTransfer = createDataTransfer();
    fireEvent.dragStart(screen.getByLabelText('Reorder Gamma'), { dataTransfer });
    fireEvent.drop(screen.getByLabelText('Reorder Beta'), { dataTransfer });

    // Gamma now sits before Beta in the global order, and Alpha stays hidden.
    expect(renderedTitles()).toEqual(['Gamma', 'Beta']);
    const globalOrder = useTaskStore
      .getState()
      .tasks.slice()
      .sort((a, b) => a.order - b.order)
      .map((task) => task.title);
    expect(globalOrder).toEqual(['Alpha', 'Gamma', 'Beta']);
  });
});
