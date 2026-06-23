/**
 * Home page
 * Main task management view
 */

import { useState } from 'react';
import TaskList from '../components/TaskList/TaskList';
import TaskFilter from '../components/TaskFilter/TaskFilter';
import TaskForm from '../components/TaskForm/TaskForm';

const Home = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Tasks
          </h1>
          <p className="text-[13px] text-neutral-400 dark:text-neutral-500 mt-0.5">
            Manage your work
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New task
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TaskFilter />
      </div>

      {/* Tasks */}
      <TaskList />

      {/* New task modal */}
      <TaskForm task={null} isOpen={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
};

export default Home;
