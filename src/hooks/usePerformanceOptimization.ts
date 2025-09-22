import { useCallback } from 'react';

/**
 * Custom hook for performance optimization utilities
 * Provides memoized functions and optimized callbacks
 */
export function usePerformanceOptimization() {
  // Debounce function for search inputs
  const debounce = useCallback(<T extends (...args: never[]) => void>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  // Throttle function for scroll events
  const throttle = useCallback(<T extends (...args: never[]) => void>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Optimized array filtering
  const optimizedFilter = useCallback(<T>(
    array: T[],
    predicate: (item: T, index: number) => boolean
  ): T[] => {
    const result: T[] = [];
    for (let i = 0; i < array.length; i++) {
      if (predicate(array[i], i)) {
        result.push(array[i]);
      }
    }
    return result;
  }, []);

  return {
    debounce,
    throttle,
    optimizedFilter,
  };
}