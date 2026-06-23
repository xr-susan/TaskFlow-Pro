/**
 * TaskFilter component
 * Minimal filter bar with compact pill selectors
 */

import { useTaskStore } from '../../stores/taskStore';
import { Priority, StatusFilter } from '../../types/task';

const TaskFilter = () => {
  const {
    filters,
    setFilter,
    resetFilters,
    categories,
    selectedTaskIds,
    deleteTasks,
    moveTasksToCategory,
    clearSelection,
    selectAllTasks,
  } = useTaskStore();

  const hasActiveFilters =
    filters.search || filters.categoryId || filters.priority || filters.status !== 'all';

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks…"
          value={filters.search}
          onChange={(e) => setFilter({ search: e.target.value })}
          className="input-field !pl-9 !pr-9"
        />
        {filters.search && (
          <button
            onClick={() => setFilter({ search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Status */}
        {(['all', 'active', 'completed', 'overdue'] as StatusFilter[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter({ status })}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
              filters.status === status
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-white/5'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}

        <div className="w-px h-4 bg-neutral-200 dark:bg-white/10 mx-0.5" />

        {/* Priority */}
        {(['high', 'medium', 'low'] as Priority[]).map((priority) => {
          const colors = { high: '#d92d20', medium: '#d98c00', low: '#1a9e6e' };
          return (
            <button
              key={priority}
              onClick={() => setFilter({ priority: filters.priority === priority ? null : priority })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
                filters.priority === priority
                  ? 'text-white'
                  : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-white/5'
              }`}
              style={filters.priority === priority ? { backgroundColor: colors[priority] } : undefined}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </button>
          );
        })}

        <div className="w-px h-4 bg-neutral-200 dark:bg-white/10 mx-0.5" />

        {/* Categories */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter({ categoryId: filters.categoryId === cat.id ? null : cat.id })}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
              filters.categoryId === cat.id
                ? 'text-white'
                : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-white/5'
            }`}
            style={filters.categoryId === cat.id ? { backgroundColor: cat.color } : undefined}
          >
            {cat.name}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="ml-1 px-2 py-1 rounded-md text-xs font-medium text-neutral-400 hover:text-neutral-600
                       hover:bg-neutral-100 dark:hover:text-neutral-300 dark:hover:bg-white/5 transition-all duration-150"
          >
            Clear
          </button>
        )}
      </div>

      {/* Batch actions */}
      {selectedTaskIds.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent-muted border border-accent/10 animate-fade-in">
          <span className="text-xs font-medium text-accent">
            {selectedTaskIds.length} selected
          </span>

          <button onClick={selectAllTasks} className="text-xs text-accent/70 hover:text-accent transition-colors">
            All
          </button>
          <button onClick={clearSelection} className="text-xs text-accent/70 hover:text-accent transition-colors">
            None
          </button>

          <div className="flex-1" />

          <select
            onChange={(e) => {
              if (e.target.value) moveTasksToCategory(selectedTaskIds, e.target.value);
            }}
            className="text-xs px-2 py-1 rounded-md border border-accent/20 bg-white dark:bg-gray-800"
            defaultValue=""
          >
            <option value="" disabled>Move to…</option>
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <button
            onClick={() => {
              if (window.confirm(`Delete ${selectedTaskIds.length} tasks?`)) deleteTasks(selectedTaskIds);
            }}
            className="text-xs text-danger hover:text-danger/80 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskFilter;
