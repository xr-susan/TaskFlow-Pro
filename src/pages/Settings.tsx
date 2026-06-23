/**
 * Settings page
 * Category management and app preferences
 */

import { useState } from 'react';
import { useTaskStore } from '../stores/taskStore';

const Settings = () => {
  const {
    categories, addCategory, updateCategory, deleteCategory,
    darkMode, toggleDarkMode, tasks,
  } = useTaskStore();

  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    if (newName.trim()) { addCategory(newName.trim()); setNewName(''); }
  };

  const handleSave = () => {
    if (editId && editName.trim()) { updateCategory(editId, editName.trim()); setEditId(null); setEditName(''); }
  };

  const handleDelete = (id: string, name: string) => {
    const count = tasks.filter((t) => t.categoryId === id).length;
    if (window.confirm(count > 0 ? `Delete "${name}"? ${count} task(s) will be uncategorized.` : `Delete "${name}"?`)) {
      deleteCategory(id);
    }
  };

  const handleExport = () => {
    const data = { tasks: useTaskStore.getState().tasks, categories: useTaskStore.getState().categories };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.tasks && data.categories) {
          localStorage.setItem('taskflow-tasks', JSON.stringify(data.tasks));
          localStorage.setItem('taskflow-categories', JSON.stringify(data.categories));
          window.location.reload();
        }
      } catch { alert('Invalid backup file'); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Settings</h1>
        <p className="text-[13px] text-neutral-400 dark:text-neutral-500 mt-0.5">
          Customize your experience
        </p>
      </div>

      <div className="space-y-4">
        {/* Appearance */}
        <section className="surface p-5">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-neutral-900 dark:text-white">Dark mode</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Toggle light and dark themes</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                darkMode ? 'bg-accent' : 'bg-neutral-200'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                darkMode ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </section>

        {/* Categories */}
        <section className="surface p-5">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Categories</h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text" value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="New category…"
              className="input-field"
            />
            <button onClick={handleAdd} disabled={!newName.trim()} className="btn-primary disabled:opacity-40">
              Add
            </button>
          </div>

          <div className="space-y-1">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                {editId === cat.id ? (
                  <>
                    <input
                      type="text" value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                      className="input-field !py-1.5 flex-1" autoFocus
                    />
                    <button onClick={handleSave} className="text-xs font-medium text-accent">Save</button>
                    <button onClick={() => setEditId(null)} className="text-xs text-neutral-400">Cancel</button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-[13px] text-neutral-900 dark:text-white">{cat.name}</span>
                    <span className="text-xs text-neutral-400">{tasks.filter((t) => t.categoryId === cat.id).length}</span>
                    <button onClick={() => { setEditId(cat.id); setEditName(cat.name); }}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1 rounded text-neutral-400 hover:text-danger transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Data */}
        <section className="surface p-5">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Data</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleExport} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-150 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors">
              <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <div className="text-left">
                <p className="text-[13px] font-medium text-neutral-900 dark:text-white">Export</p>
                <p className="text-xs text-neutral-400">Download JSON</p>
              </div>
            </button>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-150 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
              <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <div className="text-left">
                <p className="text-[13px] font-medium text-neutral-900 dark:text-white">Import</p>
                <p className="text-xs text-neutral-400">Restore backup</p>
              </div>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </section>

        {/* About */}
        <section className="surface p-5">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">About</h2>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed">
            TaskFlow Pro v1.0 — Built with React, TypeScript, Zustand, and Tailwind CSS.
            Data stored locally in your browser.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Settings;
