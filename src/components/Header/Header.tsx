/**
 * Header component
 * Minimal, professional navigation bar
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTaskStore } from '../../stores/taskStore';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTaskStore();
  const location = useLocation();

  const nav = [
    { path: '/', label: 'Tasks' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/settings', label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-card">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center
                          transition-transform duration-200 group-hover:scale-105">
              <span className="text-white dark:text-gray-900 text-sm font-bold">T</span>
            </div>
            <span className="text-[15px] font-semibold text-gray-900 dark:text-white tracking-tight">
              TaskFlow
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-0.5">
            {nav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  isActive(item.path)
                    ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              className="btn-ghost !px-2 !py-1.5"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden btn-ghost !px-2 !py-1.5"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="sm:hidden pb-3 border-t border-gray-100 dark:border-white/5 pt-2 animate-fade-in">
            {nav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10'
                    : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
