/**
 * TaskList component
 * Displays filtered tasks with empty state
 */

import { useState } from 'react';
import { Task } from '../../types/task';
import { useTaskStore } from '../../stores/taskStore';
import TaskCard from '../TaskCard/TaskCard';
import TaskForm from '../TaskForm/TaskForm';

const TaskList = () => {
  const { getFilteredTasks, filters, selectedTaskIds } = useTaskStore();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  const tasks = getFilteredTasks();

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  if (tasks.length === 0) {
    const isFiltered = filters.search || filters.categoryId || filters.priority || filters.status !== 'all';

    return (
      <>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center mb-5">
            <svg className="w-8 h-8 text-neutral-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              {isFiltered ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              )}
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
            {isFiltered ? 'No matching tasks' : 'No tasks yet'}
          </h3>
          <p className="text-[13px] text-neutral-400 dark:text-neutral-500 text-center max-w-xs leading-relaxed">
            {isFiltered
              ? 'Try adjusting your filters or search query.'
              : 'Create your first task to get started.'}
          </p>
          {isFiltered && (
            <button
              onClick={() => useTaskStore.getState().resetFilters()}
              className="mt-4 text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
        <TaskForm task={editingTask} isOpen={showForm} onClose={handleCloseForm} />
      </>
    );
  }

  return (
    <>
      {/* Count */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          {selectedTaskIds.length > 0 && ` · ${selectedTaskIds.length} selected`}
        </p>
      </div>

      {/* Task list */}
      <div className="space-y-2 stagger-children">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            isSelected={selectedTaskIds.includes(task.id)}
          />
        ))}
      </div>

      <TaskForm task={editingTask} isOpen={showForm} onClose={handleCloseForm} />
    </>
  );
};

export default TaskList;
