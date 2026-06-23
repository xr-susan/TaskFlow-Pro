/**
 * Custom hook for localStorage with TypeScript generics
 * Provides persistent state that syncs with localStorage
 */

import { useState, useEffect } from 'react';

/**
 * Hook to persist state in localStorage
 * @param key - localStorage key
 * @param initialValue - default value if nothing stored
 * @returns [value, setValue] tuple
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
