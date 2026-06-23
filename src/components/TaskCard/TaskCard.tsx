/**
 * TaskCard component
 * Clean, minimal task card with subtle interactions
 */

import { Task, PRIORITY_CONFIG } from '../../types/task';
import { useTaskStore } from '../../stores/taskStore';
import { formatDate, isOverdue, getDaysUntil } from '../../utils/formatDate';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  isSelected: boolean;
}

const TaskCard = ({ task, onEdit, isSelected }: TaskCardProps) => {
  const { toggleTask, deleteTask, selectTask, getCategoryById } = useTaskStore();
  const category = task.categoryId ? getCategoryById(task.categoryId) : null;
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const daysUntil = getDaysUntil(task.dueDate);
  const overdue = !task.completed && isOverdue(task.dueDate);

  const handleDelete = () => {
    if (window.confirm(`Delete "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  return (
    <div
      className={`group surface p-4 transition-all duration-150 hover:shadow-card-hover ${
        isSelected ? 'ring-2 ring-accent/30 border-accent/20' : ''
      } ${task.completed ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="pt-0.5 flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => selectTask(task.id)}
            className="checkbox-custom"
          />
          <button
            onClick={() => toggleTask(task.id)}
            className={`flex-shrink-0 w-[22px] h-[22px] rounded-full border-[1.5px] flex items-center justify-center
                       transition-all duration-150 hover:scale-110 ${
              task.completed
                ? 'bg-success border-success'
                : 'border-neutral-300 hover:border-neutral-500 dark:border-neutral-600 dark:hover:border-neutral-400'
            }`}
          >
            {task.completed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-[14px] leading-snug font-medium transition-colors ${
              task.completed
                ? 'line-through text-neutral-400 dark:text-neutral-500'
                : 'text-neutral-900 dark:text-white'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            {/* Priority */}
            <span
              className="pill"
              style={{
                backgroundColor: `${priorityConfig.color}12`,
                color: priorityConfig.color,
              }}
            >
              {priorityConfig.label}
            </span>

            {/* Category */}
            {category && (
              <span
                className="pill"
                style={{
                  backgroundColor: `${category.color}12`,
                  color: category.color,
                }}
              >
                {category.name}
              </span>
            )}

            {/* Due date */}
            {task.dueDate && (
              <span
                className={`pill ${
                  overdue
                    ? 'bg-danger-muted text-danger'
                    : daysUntil !== null && daysUntil <= 2
                    ? 'bg-warning-muted text-warning'
                    : 'bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-400'
                }`}
              >
                {formatDate(task.dueDate)}
                {overdue && ` · ${Math.abs(daysUntil!)}d late`}
              </span>
            )}
          </div>
        </div>

        {/* Actions - visible on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100
                       dark:hover:text-white dark:hover:bg-white/10 transition-all duration-150"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-md text-neutral-400 hover:text-danger hover:bg-danger-muted
                       dark:hover:text-danger dark:hover:bg-danger/10 transition-all duration-150"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
