/**
 * Vitest setup file.
 * Registers the jest-dom matchers and resets localStorage between tests so
 * the Zustand store, which persists to localStorage, starts from a clean slate.
 */

import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});
