/**
 * TaskForm component
 * Clean modal form for creating and editing tasks
 */

import { useState, useEffect } from 'react';
import { Task, TaskFormData, DEFAULT_TASK_FORM } from '../../types/task';
import { useTaskStore } from '../../stores/taskStore';
import { toInputDate } from '../../utils/formatDate';

interface TaskFormProps {
  task?: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const TaskForm = ({ task, isOpen, onClose }: TaskFormProps) => {
  const { addTask, updateTask, categories } = useTaskStore();
  const [formData, setFormData] = useState<TaskFormData>(DEFAULT_TASK_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        categoryId: task.categoryId,
        dueDate: task.dueDate,
      });
    } else {
      setFormData(DEFAULT_TASK_FORM);
    }
    setErrors({});
  }, [task, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (task) {
      updateTask(task.id, formData);
    } else {
      addTask(formData);
    }
    onClose();
  };

  const handleChange = (field: keyof TaskFormData, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg surface shadow-modal rounded-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-white/5">
          <h2 className="text-[15px] font-semibold text-neutral-900 dark:text-white">
            {task ? 'Edit task' : 'New task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100
                       dark:hover:text-neutral-300 dark:hover:bg-white/10 transition-all duration-150"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`input-field ${errors.title ? '!border-danger focus:!ring-danger/20' : ''}`}
              placeholder="What needs to be done?"
              autoFocus
            />
            {errors.title && <p className="mt-1 text-xs text-danger">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={2}
              className="input-field resize-none"
              placeholder="Add details…"
            />
          </div>

          {/* Row: Priority + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="input-field"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
                Category
              </label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => handleChange('categoryId', e.target.value || null)}
                className="input-field"
              >
                <option value="">None</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
              Due date
            </label>
            <input
              type="date"
              value={toInputDate(formData.dueDate)}
              onChange={(e) => handleChange('dueDate', e.target.value ? new Date(e.target.value).toISOString() : null)}
              className="input-field"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
